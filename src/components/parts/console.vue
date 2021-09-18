<template>
    <pre id="console" class="col-sm-9 col-md-6 col-lg-8"></pre>
 </template>
 <script>

export default{
    data()
    {
        return{
            
        }
    }

}
 </script>
 
 <style lang="scss" scoped>
 .console-ok{
color:green;
}
.console-err{
  color:red;
  }
.console-write{
  color:#FFF;

}
#console {
  float: left;
  height: 300px;
  width: 49%;
  overflow: auto;
  text-align: left;
  background-color: #121212;
  padding: 10px;
}  
 </style>