import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-styled',
  templateUrl: './styled.component.html',
  styleUrls: ['./styled.component.css']
})
export class StyledComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  showToolbar:boolean=false;
  loadType:string='virtualScroll';
  gridToolbarOptions = {searchPlaceholder:"Search....",csvDelimiter:'|',fileName:'SampleFile'};

  gridStyling = {
    headerBgColor:'coral',
    headerFontColor:'white',
    showInsideBorders:false,
    toolbarBgColor:'coral',
    paginatorBgColor:'coral',
    paginatorFontColor:'white',
    showEvenOdd:false,
    selectedRowBgColor:'lightblue',
    showDownloads:false
};

toolbarChange({checked}){
  this.showToolbar = checked;
}

paginatorChange({checked}){
if(checked){
  this.loadType = 'pagination'
}else{
  this.loadType = 'virtualScroll'
}
}

showBordersChange({checked}){
  if(checked){
    this.gridStyling.showInsideBorders = true;
  }else{
    this.gridStyling.showInsideBorders = false;
  }
}

evenOddChange({checked}){
  if(checked){
    this.gridStyling.showEvenOdd = true;
  }else{
    this.gridStyling.showEvenOdd = false;
  }
}

downloadsChange({checked}){
  if(checked){
    this.gridStyling.showDownloads = true;
  }else{
    this.gridStyling.showDownloads = false;
  }
}
cols=[
  {name:"userId"},
  {name:"id"},
  {name:"title"},
  {name:"completed"}
];
x=[];
dataArray = [
  {
      "userId": 256,
      "id": 1,
      "title": "delectus",
      "completed": false
  },
  {
      "userId": 89,
      "id": 2,
      "title": "quis ut",
      "completed": false
  },
  {
      "userId": 64,
      "id": 3,
      "title": "fugiat",
      "completed": false
  },
  {
      "userId": 23,
      "id": 4,
      "title": "tempora",
      "completed": true
  },
  {
      "userId": 100,
      "id": 5,
      "title": "laboriosam",
      "completed": false
  },
  {
      "userId": 999,
      "id": 6,
      "title": "ratione ",
      "completed": false
  },
  {
      "userId": 210,
      "id": 7,
      "title": "expedita",
      "completed": false
  },
  {
      "userId": 654,
      "id": 8,
      "title": "adipisci",
      "completed": true
  },
  {
    "userId": 24,
    "id": 9,
    "title": "tempora1",
    "completed": true
},
{
    "userId": 98,
    "id": 10,
    "title": "laboriosam1",
    "completed": false
},
{
    "userId": 329,
    "id": 11,
    "title": "ratione1",
    "completed": false
},
{
    "userId": 247,
    "id": 12,
    "title": "expedita1",
    "completed": false
},
{
    "userId":30,
    "id": 13,
    "title": "adipisci1",
    "completed": true
}
];
}
