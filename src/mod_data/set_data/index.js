
import {FireDb,FirebaseAuth,userId} from "@/firebase";
import {ref, set ,onValue,get, child,push,runTransaction } from "firebase/database";
import {deletep} from "@/mod_data/del_data";
import router from "@/router";

function add_program(room_id,l,k=null)
    {
     if(l=="") return;
      console.log("Add program");
      const userId = FirebaseAuth.currentUser.uid;   
    let postData =  {
                        "program_name":l,
                        "program_xml":"",
                        "program_javascript":"",
                        "program_encode":"base64"
                      };
     if(k!=null) postData=k;                 
     try
        {
      let frooms= ref(FireDb, `/users/${userId}/rooms/${room_id}/programs`);
      let newroomref = push(frooms);
      set(newroomref,postData);
      }
      catch (E)
      {
        console.error(E);
      }

      l="";
    }
    function add_event(room_id,contact=null)
    {
      if(room_id=="") return;
     if(contact==null) return;
      console.log("Add Event");
      const userId = FirebaseAuth.currentUser.uid;   
    let postData =  {
                        "contact_name":"",
                        "contact_phone":"",
                        "date":Date(),
                      };
     if(contact!=null) postData=contact;                 
     try
      {
      let frooms= ref(FireDb, `/users/${userId}/rooms/${room_id}/events`);
      let newroomref = push(frooms);
      set(newroomref,postData);
      }
      catch (E)
      {
        console.error(E);
      }

      
    }    
    function add_camera (room_id,l,k=null){
     
      if(l=="") return;
      console.log("Add Camera");
     
      const userId = FirebaseAuth.currentUser.uid;
        
    let postData =  {
          "camera_name":l,
          "camera_url":""
          };
          if(k!=null) postData=k;   
        try{
      let frooms= ref(FireDb, `/users/${userId}/rooms/${room_id}/cameras/`);
      let newroomref = push(frooms);
      set(newroomref,postData);
      }
      catch (E)
      {
        console.error(E);
      }

    }
    function add_device(room_id,l,k=null)
    {
     
      if(l=="") return;
      console.log("Add Device");
      //const room_id=this.$route.params.rid;
      const userId = FirebaseAuth.currentUser.uid;
        
    let postData =  {
                                "device_name":l,
                                "mode":"relay",
                                "status":"0"
                      };
    if(k!=null) postData=k;
   try
      {
      let frooms= ref(FireDb, `/users/${userId}/rooms/${room_id}/devices/`);
      let newroomref = push(frooms);
      set(newroomref,postData);
      }
      catch (E)
      {
        console.error(E);
      }
    }

   function add_room(room_name,k=null)
    {
      console.log("Add Room");
      console.log(room_name);
      if(room_name==="") return;
      console.log("Add Room");
        
    let postData = {
                        "room_name":room_name,
                        "programs":{
                           "test": {
                                "program_name":"test",
                                "active_program":true,
                                "program_xml":"",
                                "program_javascript":"",
                                "program_active":true}
                        }
                        ,
                        "devices":[]};
    if(k!=null) postData=k;
    postData.room_name=room_name;
       try
      {
      let frooms= ref(FireDb, `users/${FirebaseAuth._currentUser.uid}/rooms`);
      let newroomref = push(frooms);
      set(newroomref,postData);
      }
      catch (E)
      {
        console.error(E);
      }
      //this.showDialog=false;
      
       
    }
function start_run(room_id,team_name)
{     
      const userId = FirebaseAuth.currentUser.uid;
      let active_program=null;

      if(status_run!=null) return;
      
      onValue(ref(FireDb, `/users/${userId}/rooms/${room_id}/active_program`),(sn)=>
      {
        if(sn.exists()) active_program=sn.val();
      });
      let frooms= ref(FireDb, `/users/${userId}/rooms/${room_id}/current_run`);
      //let newroomref = push(frooms);
      let postData={
        team_name:team_name,
        starting_time:Date(),
        program_id:active_program,
        finishing_time:"NULL"
      };
      set(frooms,postData);
    
}
function stop_run(room_id)
{     
      const userId = FirebaseAuth.currentUser.uid;
      let postData=null;
      let frooms= ref(FireDb, `/users/${userId}/rooms/${room_id}/past_runs/`);
      let newroomref = push(frooms);
      
      postData=status_run(room_id);
      postData.finishing_time=Date();
      set(newroomref,postData);
      deletep(`rooms/${room_id}/current_run`);
      
}
function status_run(room_id)
{     
      const userId = FirebaseAuth.currentUser.uid;
      let postData=null;
      onValue(ref(FireDb, `/users/${userId}/rooms/${room_id}/current_run`),(sn)=>
      {
        if(sn.exists()) postData=sn.val();
      });
      return postData;
  }        
   

export
{
    add_program,
    add_camera,
    add_device,
    start_run,
    status_run,
    stop_run,
    add_room,
    add_event

}