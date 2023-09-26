<template>
  <aside>
    <p><b>Menu</b></p>
    <a class="mr-3" v-on:click="onSelectFileType(claritySheet)"
      ><i class="fa fa-file" style="color: darkcyan" aria-hidden="true"></i
      ><b>Clarity</b>
    </a>
    <a class="mr-4" v-on:click="onSelectFileType(rotaSheet)"
      ><i class="fa fa-file" style="color: darkcyan" aria-hidden="true"></i
      ><b>Rota</b>
    </a>
    <a v-on:click="onSelectFileType(fieldGlassSheet)" class="fieldglass"
      ><i class="fa fa-file" style="color: darkcyan" aria-hidden="true"></i
      ><b>FieldGlass</b>
    </a>
    <button class="btn btn-light mt-4" @click="backBtn">
      <i class="fa fa-arrow-left" aria-hidden="true"></i>&nbsp; Back
    </button>
  </aside>
  <div class="container">
    <button class="twoToneButton" @click="downloadFile">Export to CSV</button>
    <div v-if="clarity">
      <div class="table table-striped">
        <table class="">
          <thead>
            <th
              style="color: white"
              v-for="headers in clarityHeaders"
              v-bind:key="headers.key"
            >
              {{ headers }}
            </th>
          </thead>
          <tbody>
            <tr v-for="(row, index1) in clarityTableData" v-bind:key="index1">
              <td v-for="(value, index2) in row" v-bind:key="index2">
                {{ value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- rota file -->
    <div v-if="rota">
      <div class="table table-striped">
        <table class="">
          <thead>
            <th
              style="color: white"
              v-for="headers in rotaHeaders"
              v-bind:key="headers.key"
            >
              {{ headers }}
            </th>
          </thead>
          <tbody>
            <tr v-for="(row, index1) in RotaData" v-bind:key="index1">
              <td v-for="(value, index2) in row" v-bind:key="index2">
                {{ value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- fieldGlass table -->
    <div v-if="fieldGlass">
      <div class="table table-striped">
        <table class="">
          <thead>
            <th
              style="color: white"
              v-for="headers in fieldglassHeaders"
              v-bind:key="headers.key"
            >
              {{ headers }}
            </th>
          </thead>
          <tbody>
            <tr
              v-for="(row, index1) in FieldGlassTableData"
              v-bind:key="index1"
            >
              <td v-for="(value, index2) in row" v-bind:key="index2">
                {{ value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  
</template>
<script>
import exportFromJSON from "export-from-json";
export default {
  data() {
    return {
      claritySheet:"clarity",
      rotaSheet:"rota",
      fieldGlassSheet:"fieldGlass",
      RotaData: [],
      clarityData: [],
      csvData: [],
      monthStartDate: "",
      clarityHeaders: [],
      rotaHeaders: [],
      fieldglassHeaders: [],
      RotaArr: [],
      clarityArr: [],
      clarityTableData: [],
      rotaTableData: [],
      convertedResponseData: [],
      list: [],
      FieldArr: [],
      FieldGlassTableData: [],
      clarity: true,
      rota: false,
      fieldGlass: false,
    };
  },
  created() {
    //getting data from local storage
  
    console.log(this.convertedResponseData);
    //Getting Rota Data from local storage
    this.RotaArr = localStorage.getItem("RotaData");
    this.RotaData = JSON.parse(this.RotaArr);
    //Getting Clarity Data from local storage
    this.clarityArr = localStorage.getItem("ClarityData");
    this.clarityTableData = JSON.parse(this.clarityArr);
    //Getting FieldGlass Data from local storage
    this.FieldArr = localStorage.getItem("fieldGlassData");
    this.FieldGlassTableData = JSON.parse(this.FieldArr);
    console.log(this.FieldGlassTableData);
    this.rotaTableData = JSON.parse(this.RotaArr);
    console.log(this.rotaTableData);
    this.clarityData = JSON.parse(this.clarityArr);
     //headers array for clarity table
     this.clarityHeaders = Object.keys(this.clarityTableData[0]);
     if(this.RotaData)
     {
    //headers array for rota table
    this.rotaHeaders = Object.keys(this.rotaTableData[0]);
    console.log(this.headers1)
     }
    //headers array for FieldGlass table
    this.fieldglassHeaders = Object.keys(this.FieldGlassTableData[0]);
    console.log(this.headers2)
    //Getting first date of month
    this.monthStartDate = Object.keys(this.clarityData[0])[2];
    if (this.RotaData != null) {
      //conversion of date values into days and dates
      for (const i of this.RotaData) {
        var date = new Date(
          Math.round((i.Date - 25569) * 86400 * 1000)
        ).toLocaleString();
        //splitting date after comma
        i.Date = date.split(",", 1)[0];
        // logic for converting dates to days dynamically
        let days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        days.forEach((day, index) => {
          // Check if the index of day value is equal to the returned value of getDay()
          if (index == new Date(i.Date).getDay()) {
            i.Day = day;
          }
        });
      }
      for(const i of this.FieldGlassTableData)
      {
        var fieldGlassDate = new Date(
          Math.round((i.Date - 25569) * 86400 * 1000)
        ).toLocaleString();
        //splitting date after comma
        i.Date = fieldGlassDate.split(",", 1)[0];
        var weekStartDate = new Date(
          Math.round((i.Week_Start_Date - 25569) * 86400 * 1000)
        ).toLocaleString();
        i.Week_Start_Date=weekStartDate.split(",", 1)[0];
      }
    }
  },
  methods: {
    // on click of export button
    downloadFile() {
      //this.getData();
      this.list = localStorage.getItem("responseData");
    this.convertedResponseData = JSON.parse(this.list);
      const data = this.convertedResponseData;
      const fileName = "Fieldglass";
      const exportType = exportFromJSON.types.csv;
      if (data) exportFromJSON({ data, fileName, exportType });
    },
    onSelectFileType(e)
    {
     console.log(e)
     if(e==this.claritySheet)
     {
      
      this.clarity =true
       this.rota =false
      this.fieldGlass =false
     console.log(this.clarity)
     }
     else if(e==this.rotaSheet)
     {
      
       this.clarity =false
       this.rota =true
      this.fieldGlass =false
     }
     else{
      
       this.clarity =false
       this.rota =false
      this.fieldGlass =true
     }
    },
    backBtn() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.table-striped {
  overflow: auto;
  height: 423px;
  width: 1000px;
}
/* .tableFixHead thead th { */
.table-striped thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #007066;
}
.table-striped tbody th {
  position: sticky;
  left: 0;
}

/* Just common table stuff. Really. */
table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  padding: 8px 16px;
  white-space: nowrap;
}
th {
  background: #eee;
}
.table-striped,
.table-striped td {
  box-shadow: inset 1px -1px grey;
}
.table-striped th {
  box-shadow: inset 1px 1px grey, 0 1px grey;
}
.twoToneButton {
  padding: 10px 12px;
  margin: 1em;
  border: 0;
  color: white;
  border-radius: 7px;
  background: #007066;
  font-size: 12px;
}
.container {
  margin-left: 200px;
  padding: 20px;
  max-width:1000px;
}

.fieldglass {
  margin-left: 10px;
}
aside {
  color: 848686;
  width: 160px;
  /* padding-left: 20px; */
  height: 90vh;
  background-image: linear-gradient(30deg, #4ba07e, #e5b50a);
  /* border-top-right-radius: 80px; */
  position: absolute;
  left: 0;
}

aside a {
  font-size: 12px;
  /* color: #fff; */
  color: #3f5efb;

  display: block;
  padding: 12px;
  /* padding-left: 30px; */
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

aside a:hover {
  width: 170px;
  color: #3f5efb;
  background: white;
  outline: none;
  position: relative;
  background-color: #fff;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}

aside a i {
  margin-right: 5px;
}

aside a:hover::after {
  content: "";
  position: absolute;
  background-color: transparent;
  bottom: 100%;
  right: 0;
  height: 35px;
  width: 35px;
  border-bottom-right-radius: 18px;
  box-shadow: 0 20px 0 #fff;
}

aside a:hover::before {
  content: "";
  position: absolute;
  background-color: transparent;
  top: 38px;
  right: 0;
  height: 35px;
  width: 35px;
  border-top-right-radius: 18px;
  box-shadow: 0 -20px 0 0 #fff;
}

aside p {
  margin: 0;
  padding: 40px 0;
}

body {
  font-family: "Avenir, Helvetica, Arial, sans-serif";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
  color: black;


  /* height: 100vh; */
  margin: 0;
}
</style>
