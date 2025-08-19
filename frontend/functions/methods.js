import { userAPI } from "../store/API/API_URL";

export const CreateClasses = (...allClasses)=>{

// console.log(allClasses);

if(allClasses.length===0 || !allClasses)
{
    return "";
}


let classeString = ``;

allClasses.forEach(element => {
    classeString += element + ' '; 
});
//  console.log(classeString);
 
return classeString;

}

export const getRandomID = ()=>
{
  return (Math.random()*1000).toFixed(0);
}

export function formatMongoDateToWords(mongoDate) {
  const date = new Date(mongoDate);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }); // May, Jun, etc.
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

// Example usage:
console.log(formatMongoDateToWords("2025-07-31T10:01:41.961Z")); // 31 Jul 2025


export function trim_text(text, ch,ext=false) {
    
    


    if (+(text.length) >= ch) {
        text = `${text.slice(0, ch)}...${ext===true?text.slice(-7):""}`;
   

    }
    return text;
}


export async function Fetch_Data(root, type, wantToSendData = false,data=null ) {
    try {
      
   
    let res;
    if (wantToSendData) {
      // console.log("data");
  
      res = await fetch(root, {
        method: type,
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
  
      })
    } else {
      // console.log("data no");
  
      res = await fetch(root, {
        method: type,
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        credentials: "include"
      })
    }
  
    res = await res.json();
    return res;
  } catch (error) {
    console.log(error);   
    return {
      success:false,
      msg:"500 Internal Server Error"
    }
  }
  }


export async function is_login()  
{
  const {url,method} = userAPI.isLogin;
  const response = await Fetch_Data(url,method);
  return response;
}