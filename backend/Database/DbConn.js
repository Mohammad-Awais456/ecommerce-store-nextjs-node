import mongoose from "mongoose";

export const DbConnect = async ()=>{
 await mongoose.connect(process.env.DB_URL);
 
}



mongoose.connection.on('connected', () => {
      console.log("\n\n==============================\nDatabase Status : Connected"); 
      console.log("Database Name   : "+mongoose.connection.name); 
      console.log("Database host   : "+mongoose.connection.host+"\n=============================="); 
  });

