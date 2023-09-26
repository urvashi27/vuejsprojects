<template>
   <Snackbar v-model="snack.show" :mode="snack.mode" :message="snack.message"></Snackbar>
  <div class="d-flex justify-content-center">
    <div class="card border-secondary">
      <div class="card-header" style="background-color: #007066; color: white">
        <span style="font-family: Verdana, sans-serif"
          ><b>Upload Clarity</b></span
        >
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="icons fa-4x">
              <i
                class="fas fa-upload"
                style="color: rgba(198, 198, 198, 0.65)"
              ></i>
              <div class="upload-text">
                <button type="button" class="upload">
                  <!-- <i class="fa fa-upload"></i>  -->
                  Upload File
                  <input
                    type="file"
                    multiple="multiple"
                    @change="handleFileUpload($event)"
                  />
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div>
              <div>
                <span v-if="files.length != 0">
                  <h6 class="left1" v-for="name in files" :key="name">
                    {{ name }}
                    <button class="btn" @click="removeFile(name)">
                      <i class="fa fa-light fa-trash"></i>
                    </button>
                  </h6>
                </span>
                <div v-show="files.length === 0">
                  <h6 class="file__name">No File Selected</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-md-4">
            <h6>Select File</h6>
            <!-- <button class="btn btn-primary">Select</button> -->
            <select class="custom-select" v-model="fileType">
              <option value="clarity" selected>Clarity</option>
              <option value="rota">Rota</option>
              <option value="fieldglass">Fieldglass</option>
            </select>
          </div>
       
          <div class="col-md-8">
            <button :disabled="files.length<2" class="btnn float-right" v-on:click="submitFile()">
              <i class="fa fa-upload" aria-hidden="true"></i>
              <b> Export Clarity Data</b>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as XLSX from "xlsx/xlsx.mjs";
import FileUploadService from "@/services/FileUploadService";
import Snackbar from './Snackbar';
export default {
  //name:'snackbar',
  components: {
   
    Snackbar:Snackbar
    
  },
  data() {
    return {
      snack: {
        mode: '',
        message: '',
        show: false
      },
      file: [],
      files: [],
      fileType: "clarity",
      formData: null,
      convertedResponseData: [],
      filename: "No file selected",
      loading: false,
      inputMessage: "",
      clarityFiles: [],
      formated: "",
    
      today: "",
      tmonth: "",
      selectedCategory: "",
      headers: [],
      clarityData1: [],
      clarityData: [],
      fieldData1: [],
      fieldData: [],
    
      checkClarityData: "Employee Name",
      checkRotaValidation: "Day",
      checkFieldGlassValidation: "Worker_Id",
      data: "",
      fieldGlass: [],
      filesArray: [],
      clarityFile: "",
      fieldGlassFile: "",
      rotaFile:''
    };
  },
  created() {
    localStorage.clear();
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    this.today = yyyy + "-" + mm;
    console.log(typeof this.today);
  },
  methods: {
   
    //on select of delete icon 
    removeFile(name) {
      this.files.splice(this.files.indexOf(name), 1);
    },

    handleFileUpload(event) {
    
      this.formData = new FormData();
      if (this.fileType == "clarity") {
        this.clarityFile = event.target.files[0];
        this.filesArray.push(this.clarityFile);
       
      }
      if (this.fileType == "fieldglass") {
        this.fieldGlassFile = event.target.files[0];
        this.filesArray.push(this.fieldGlassFile);
       
      }
      if(this.fileType=="rota")
      {
        this.rotaFile=event.target.files[0];
      }
      this.formData.append("fieldGlass", this.fieldGlassFile);
      this.formData.append("clarity", this.clarityFile);
      this.formData.append('rota',this.rotaFile);
      console.log(this.filesArray);

      this.file = event.target.files[0];

      for (var i = 0; i < event.target.files.length; i++) {
       
        this.filename = event.target.files[i].name;
        this.files.push(this.filename);
      }

      if (this.file) {
        const reader = new FileReader();
        // var fileReader = new FileReader();
        reader.onload = (e) => {
          /* Parse data */
          const bstr = e.target.result;
          XLSX.read(bstr, {
            type: "binary",
            cellDates: true,
            dateNF: "yyyy/mm/dd;@",
          });
          var workbook = XLSX.read(bstr, {
            type: "binary",
          });
          workbook.SheetNames.forEach((sheet) => {
            this.excelData = XLSX.utils.sheet_to_row_object_array(
              workbook.Sheets[sheet],{defval:""}
            );

            this.clarityData1 = JSON.stringify(this.excelData);
            this.clarityData = JSON.parse(this.clarityData1);

            this.headers = Object.keys(this.clarityData[0]);

            this.headers = Object.keys(this.clarityData[0]);

            this.fieldData1 = JSON.stringify(this.excelData);
            this.fieldData = JSON.parse(this.fieldData1);
            for (const i of this.fieldData) {
              var date = new Date(
                Math.round((i.Date - 25569) * 86400 * 1000)
              ).toLocaleString();

              i.Date = date.replace(/\//g, "-").split(",", 1)[0];
            }

            //Validations for clarity file
            if (this.fileType == "clarity") {
              if (this.checkClarityData === this.headers[0]) {
                localStorage.setItem(
                  "ClarityData",
                  JSON.stringify(this.excelData)
                );
              } else {
                
                  this.showError("This is not Clarity File. Please, select the correct file ");
                
                this.files.pop();
               
              }
            }
               //Validations for rota file
            if (this.fileType == "rota") {
              if (this.checkRotaValidation === this.headers[0]) {
                localStorage.setItem(
                  "RotaData",
                  JSON.stringify(this.excelData)
                );
              } else {
                this.showError(
                  "This is not Rota File. Please, select the correct file "
                );
                this.files.pop()
               
              }
            }
               //Validations for field glass file
            if (this.fileType == "fieldglass") {
              if (this.checkFieldGlassValidation === this.headers[0]) {
                console.log(this.fieldData);
                localStorage.setItem(
                  "fieldGlassData",
                  JSON.stringify(this.excelData)
                );
              } else {
                this.showError(
                  "This is not Fieldglass File. Please, select the correct file "
                );
               this.files.pop();
              }
            }
          });
        };
        reader.readAsBinaryString(this.file);
      }
        if (this.file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || this.file.type =="text/csv"){
    // Api call
 }
 else {
   this.showError("Please Upload xlsx And csv File", "error")
   this.files.pop();
   
 }
      
      
 
 },
    
    submitFile() {
      this.$router.push("clarity");
      FileUploadService.uploadFiles(this.formData).then((response) => {
        console.log(JSON.stringify(response.data));
        this.convertedResponseData = JSON.stringify(response.data);
        localStorage.setItem("responseData", this.convertedResponseData);
      });
    },
    showError(msg) {
      this.snack = {
        mode: 'error',
        message:msg,
        show: true
      };
    },
  }
  
};
</script>
<style scoped="css">
.file__name {
  line-height: 40px;
  margin-left: 0.5em;
  border: none;
  overflow: hidden;
  top: 10px;
  position: relative;
  width: 100%;
  margin: 0;
  color: var(--icon-color);
  background-color: white;
  border-radius: var(--dialog-border-radius);
  padding: var(--dialog-padding);
  transition: 0.2s;
  border: solid 2px #007066;
}
.left2 {
  top: 10px;
  position: relative;
  width: 100%;
  height: 300%;
  margin: 0;
  color: var(--icon-color);
  background-color: white;
  border-radius: var(--dialog-border-radius);
  padding: var(--dialog-padding);
  transition: 0.2s;
  border: solid 2px #007066;
}
.left1 {
  line-height: 40px;
  justify-content: space-between;
  top: 10px;
  position: relative;
  width: 100%;
  height: 350%;
  margin: 0;
  color: var(--icon-color);
  background-color: white;
  border-radius: var(--dialog-border-radius);
  padding: var(--dialog-padding);
  transition: 0.2s;
  border: solid 2px #007066;
}
.upload {
  position: relative;
  padding: 11px 16px;
  font-size: 15px;
  line-height: 1.5;
  border-radius: 3px;
  color: #fff;
  background-color: #ffc100;
  border: 0;
  transition: 0.2s;
  overflow: hidden;
}
.upload [type="file"] {
  cursor: pointer;
  position: absolute;
  left: 0%;
  top: 0%;
  transform: scale(3);
  opacity: 0;
}
.card {
  justify-content: center;
  margin-top: 70px;
  width: 600px;
  /* height: 340px; */
}
.upload {
  background-color: #007066;
}
.showfilebox {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
  padding: 10px 25px;
  box-shadow: #eeeeeeed 0px 0px 0px 1px, #d1d5db3d 0px 0px 0px 1px inset;
  border: solid 1px #007066;
}
.showfilebox .left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.btn {
  border-radius: 15px;
  width: 40px;
  height: 37px;
}
.btnn {
  height: 50px;
  /* width: 160px; */
  padding: 10px 12px;
  margin: 1em;
  border: 0;
  color: white;
  border-radius: 15px;
  background: #f2c000;
  font-size: 12px;
}
.btnn:disabled,
.btnn[disabled]{
  border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
}
.upload-text {
  /* position: absolute; */
  margin-bottom: 0.75em;
  display: flex;
  flex-flow: column;
  align-items: center;
  left: calc(50% - 59px);
  font-size: 10px;
  color: #b7b7b7;
}
.upload-text button {
  padding: 8px 12px;
  border-radius: 55px;
  border: 0;
  color: white;
  border-radius: 7px;
  /* background: rgb(151, 223, 151); */
  font-size: 12px;
}
/* .custom-select{
border-radius: 15px;
height: 50px;
} */
/* .form-control{
border-radius: 15px;
height: 50px;
width: 10px;
} */
.icons {
  /* border: 5px dashed rgba(198, 198, 198, 0.65); */
  /* border: 5px dashed #6a9d5e; */
  border: 2px dashed #007066;
  /* border: 3px dashed #007066; */
  /*   border-radius: 4px; */
  /* padding: 20px; */
}
</style>
