import { Component, OnInit,Input,Output,ViewChild,EventEmitter } from '@angular/core';

@Component({
  selector: 'ngxdatagrid',
  templateUrl: './ngxdatagrid.component.html',
  styleUrls: ['./ngxdatagrid.component.css']
})
export class NgxdatagridComponent implements OnInit {

  @Input('rows') rows:any;
  @Input('columns') columns:any;
  @Input('gridHeight') gridHeight:any;
  @Input('gridWidth') gridWidth:any;
  @Input('headerRowHeight') headerRowHeight:any;
  @Input('rowHeight') rowHeight:number;
  @Input('selectionType') selectionType:string;
  @Input('draggableColumns') isDraggable:boolean=false;
  @Input('forceColumnWidth') forceColumnWidth:boolean;
  @Output()  selectedData: EventEmitter<any> = new EventEmitter();
  @ViewChild('normalCellTemplate') normalCellTemplate:any;
  
  columnWidth:any;
  isCheckboxable:boolean = false;
  rowsCopy=[];                                      // backup for sorting and search
  gridRows=[];                                      // this array is assigned to the grid for iteration of grid rows
  gridColumns=[];
  isAsc:boolean=false;                           
  lastPropToSort:string;
  selectedRows:any=[];                              // selected rows from the grid will be stored in this array
  rowWidth:number;
  dragSourceColumnIndex:number;
  dropDestinationColumnIndex:number;
  countOfItemsScrolled:number=0;
  totalScrollHeight:number=0;
  countOfItemsInViewPort:number=0;
  viewPortItemStartIndex:number=0;
  viewPortItemEndIndex:number=0;
  lastScrollTop:number=0;
  constructor() { }

  ngOnInit() {
    let firstColumn = {};
    if(this.selectionType == 'multiple'){
      this.isCheckboxable = true;                   // this adds an extra column with checkbox for every row
      firstColumn = {name:'checkboxColumn',width:'25'}
    }else if(this.selectionType == 'single'){
      this.isCheckboxable = true;                  
      firstColumn = {name:'radioColumn',width:'25'}
    }
    if(this.isCheckboxable){
      this.columns = [firstColumn,...this.columns]; //adding the checkbox column for multiple selection
      this.columnWidth = ((this.gridWidth-this.columns.length-25)/(this.columns.length-1)); // assigning column width by excluding the checknox column
    }else{
      this.columnWidth = ((this.gridWidth-this.columns.length)/this.columns.length);
    }
    let leftToAdd:number=0;
    this.columns.map((column,index)=>{
      if(column.name != 'checkboxColumn' && column.name != 'radioColumn'){
        if(!this.forceColumnWidth){
          column['width'] = this.columnWidth;
        }
        if(column.cellTemplate == undefined){        
          column['cellTemplate'] = this.normalCellTemplate;   // if no cell-template is defined, adding the default normal cell template
        }
      } 
      if(index == 0){
        column['left']=0;
        leftToAdd += Number(column['width']);
      }if(index != 0){
        column['left'] = leftToAdd+index;
        leftToAdd += Number(column['width']);
      }      
    })
    this.rowWidth = leftToAdd+this.columns.length;

    this.rows.map((row,index)=>{
      row['top'] = (index * this.rowHeight);
    })
    this.rowsCopy = JSON.parse(JSON.stringify(this.rows));
    this.countOfItemsInViewPort = Math.ceil((this.gridHeight-this.headerRowHeight)/this.rowHeight);
    this.totalScrollHeight = (this.rows.length * this.rowHeight);
    this.gridRows = this.rows.filter((row,index)=>{
      if(index>=0 && index<=this.countOfItemsInViewPort+1){
        return row;
      }
    })
    this.gridRows.map((row,index)=>{
      row['trackingIndex'] = index;
      row['checked'] = false;
    })
    this.viewPortItemEndIndex = this.countOfItemsInViewPort;
    console.log(this.columns);
    console.log(this.rowWidth,"rowWidth");
  }

  ngOnChanges(){
    this.rows.map((row,index)=>{
      row['top'] = (index * this.rowHeight);
      row['trackingIndex'] = index;
      row['checked'] = false;
    })
    this.rowsCopy = JSON.parse(JSON.stringify(this.rows));
    this.gridRows = [...this.rows];
  }
  
  // convert column name to more readable form
  resolveName(prop){                               
    if(prop == 'checkboxColumn' || prop == 'radioColumn'){
      return ' ';
    }
    return prop.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })
  }


  multiSelectRow({checked},row,trackingIndex){
    row.checked = checked;
    if(checked){   // if row is checked, push it into selected array
      this.selectedRows = [row,...this.selectedRows];
    }else{         // if row is unchecked, remove it from the selected array
      this.selectedRows = this.selectedRows.filter(row=>row.trackingIndex != trackingIndex);
    }
    this.selectedData.emit(this.selectedRows);
  }

  singleSelectRow({checked},row,trackingIndex){
    this.gridRows.map(row=>{
      if(row.trackingIndex == trackingIndex){
        this.selectedRows = row;
        row.checked = true;
      }else{
        row.checked = false;
      }
    })
    this.selectedData.emit(this.selectedRows);
  }

    dragStart(event,columnIndex){
      event.stopPropagation(); 
      this.dragSourceColumnIndex = columnIndex;
    }
    
    allowDrop(event) {
      event.stopPropagation();   
      event.preventDefault();
    }
    
    drop(event,columnIndex) {
      event.stopPropagation();   
      event.preventDefault();  
      this.dropDestinationColumnIndex=columnIndex;
      let item1 = this.columns[this.dragSourceColumnIndex];
      let item2 = this.columns[this.dropDestinationColumnIndex];
      this.columns[this.dropDestinationColumnIndex] = item1;
      this.columns[this.dragSourceColumnIndex] = item2;
      this.columns=[...this.columns];
    }

    changeInView(event){
      this.countOfItemsScrolled = Math.ceil(event/this.rowHeight);
      this.viewPortItemStartIndex = this.countOfItemsScrolled;
      this.viewPortItemEndIndex = this.viewPortItemStartIndex + this.countOfItemsInViewPort;
      if(this.lastScrollTop != this.viewPortItemStartIndex){
      let itemsToReturn = this.rows.filter((row,index)=>{
        if((index>=this.viewPortItemStartIndex-1) && (index<=this.viewPortItemEndIndex)){ 
          return row;
        }
      })
      this.gridRows = [...itemsToReturn];    
      }
      this.lastScrollTop = this.viewPortItemStartIndex;
    }
    
    mergeSort(arrayToSort,prop){
      if (arrayToSort.length < 2)
        return arrayToSort;
      let middle:number = parseInt((arrayToSort.length/2).toString());
      let leftItems   = arrayToSort.slice(0, middle);
      let rightItems  = arrayToSort.slice(middle, arrayToSort.length);
      return this.merge(this.mergeSort(leftItems,prop),this.mergeSort(rightItems,prop),prop);
    }
    
    merge(left, right,prop){
      let mergedResult = [];
      while (left.length && right.length) {
        if (left[0][prop] <= right[0][prop]) {
          mergedResult = [...mergedResult,left.shift()];
        }else{
          mergedResult = [...mergedResult,right.shift()];
        }
      }
      while (left.length){
        mergedResult = [...mergedResult,left.shift()];
      }   
      while (right.length){
        mergedResult = [...mergedResult,right.shift()];
      }
      return mergedResult;
   }

    callSort(prop){
      if(this.lastPropToSort != prop){      // if property to sort is not same as the last sorted property, get a copy and sort
        this.rows = [...this.rowsCopy];
        let x = this.mergeSort(this.rows,prop);
        this.rows = x;
      }else{
        this.rows.reverse();         // if property to sort is same as last sorted property, just reverse the array
      }
      this.lastPropToSort = prop;
      this.isAsc = !this.isAsc;
      this.rows.map((row,index)=>{
        row['top'] = (index * this.rowHeight);
        row['trackingIndex'] = index;
      })
      let itemsToReturn = this.rows.filter((row,index)=>{
        if((index>=this.viewPortItemStartIndex-1) && (index<=this.viewPortItemEndIndex)){ 
          return row;
        }
      })
      this.gridRows = [...itemsToReturn];   
    }
    
    headerCheckboxChecked({checked}){
      if(checked){    // if row is checked, push it into selected array
        this.rows.map(row=>row.checked = true);
        this.selectedRows = this.rows;
      }else{          // if row is unchecked, remove it from the selected array
        this.rows.map(row=>row.checked = false);
        this.selectedRows = [];
      }
      this.selectedData.emit(this.selectedRows);
    }
}
