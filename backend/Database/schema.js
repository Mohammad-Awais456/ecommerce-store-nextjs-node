import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { ErrorHandlerClass } from "../utils/ErrorHandlerClass.js";
import { type } from "os";



// Products schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Please, Enter Product Name!"] },
    description:
    {
        type: String,
        required: [true, "Please, Enter Product Description!"]
    },
    createdBy:
    {
        type: mongoose.Schema.ObjectId,
        required: [true, "Please include id of the product creator!"]
    },
    featuredProduct:{
        type: Boolean,
        default: false,
    },
    price:
    {
        type: Number,
        required: [true, "Please, Enter Product Price!"]
    },
    rating:{
        type:Number,
        default:0
    },
    gallery: {
        images: [
            {
                type: String, // just the image filename, e.g., "product1.jpg"
                required: true
            }
        ],
        featuredImage: {
            type: Number, // index of main image in images array
            default: 0
        }
    }
    ,
    categories: [
        {
            type: String,
            required: [true, "Please select product category"]

        }
    ]
    ,
    stock: {
        type: Number,
        // required: [true, "Please, Enter Product Stock!"],
        max: [99999, "Stock cannot exceed 5 characters."],

        // default: 1
    },

    DOC: { type: Date, default: Date.now }

});
// Default Website Settings Schema
const WebsiteSettingSchema = new mongoose.Schema({
  productCategories: [
    {
      id: { type: String, default: null },
      name: { type: String, default: "" },
    }
  ],
  logo:  { type: String, default: "" },
  siteTitle: { type: String, default: "My App" },  
  siteDescription: { type: String, default: "" }
  
}, { timestamps: true });

// Ensure a default document exists
WebsiteSettingSchema.statics.ensureDefaults = async function () {
  const count = await this.countDocuments();
  if (count === 0) {
    await this.create({
      productCategories: [],
      logo:"",
      siteTitle:"My App",
      siteDescription:"This is default description, change it from admin panel."
    });
  }
};
// Users schema
const userSchema = new mongoose.Schema({
name:{
    type:String,
    minlength:[2,"Name must be longer than 2 characters"],
    maxlength:[30,"Name must be shorter than 30 characters"],
    required:[true,"Please, enter your name!"],
},

username:{
    type:String,
    minlength:[3,"Name must be longer than 3 characters"],
    maxlength:[15,"Name must be longer than 15 characters"],
    required:[true,"Please, provide username!"],
    unique:[true,"User Name already exists!"],

},
verified:{
    type:Boolean,
    default:false
},
email:{  
    type:String, 
    validate:{
        validator: function(value)
        {

           return validator.isEmail(value);
        },
        message: props => `${props.value} is not valid email!`
    },
    unique: [true,"Email already exists!"],
    required:[true,"Please, provide your email!"]
},
password:{
    type:String,
    select:false,
    required:[true,"Please, provide a password!"]
},
role:{
    default:"user",
    type:String
},
tokens:[],
avatar: {
    plublic_id: {type:String},
    url: {type:String},
},
createdAt: {
    type: Date,
    default: Date.now
},
// avatar: {
//     plublic_id: {type:String,required:[true,"Please, provide public id of the image!"]},
//     url: {type:String,required:[true,"Please, provide url of the image!"]},
// },
verificationToken : {token:{type:String},expiry:{type:Date}},
   

});
 userSchema.statics.ensureDefaults = async function () {
  const count = await this.countDocuments();
  if (count === 0) {
    await this.create({
    "name":"Admin",
    "username":"admin",
    "password":"111",
    "verified":true,
    "email":"contact@awaissolutions.pro",
     "role":"admin"


});
  }
};
//Product Reviews Schems 
const productReviewsSchema = new mongoose.Schema({
        
        approved:{
            type:Boolean,
            default:false
        },

        productId:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"products",
            required:[true,"Please provide the ID of the product that this review belongs to"]
        },
        user:
        {
            type:String,
            required:[true,"Please provide user name who is writing product review."]
        },
       
       rating:
        {
            type: Number,
            required: [true, "Please, Provide Product Rating!"],
            min: [1, "Rating must be at least 1."],
            max: [5, "Rating must be no more than 5"]
        },
        comment:
        {
            type: String,
            maxlength:[200,"Comment can't be more than 200 characters long."],
            minlength:[3,"Comment can't be less than 3 characters."],
            required: [true, "Please, Write Product Comment!"]

        },

       DOC: { type: Date, default: Date.now }
})

// Order Schema 
export const orderSchema  = new mongoose.Schema({

  totalPrice:{type:Number,default:0,required:[true,"Please, provide total charges including everything (tax, shipping)."]},
  orderStatus:{type:String,default:"Processing"},
  shippingInfo: {

    personName: {
      type: String,
      required: [true, "Please provide the city."]
    },
    city: {
      type: String,
      required: [true, "Please provide the city."]
    },
    country: {
      type: String,
      required: [true, "Please provide the country."]
    },
    address: {
      type: String,
      required: [true, "Please provide the address."]
    },
    contactNumber: {
      type: String,
      required: [true, "Please provide the contact number."]
    }
  },
  orderItems:[
    {
        name:{type:String,required:[true,"Please, provide ordered item name!"]},
        price:{type:Number,required:[true,"Please, provide ordered item price!"]},
        quantity:{type:Number,required:[true,"Please, provide ordered item quantity!"]},
        image:{type:String,required:[true,"Please, provide ordered item image link!"]},
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"products",
            required:[true,"Please, provide ordered item id!"]

        }
    }  
  ],
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users",
    required:[true,"Please, user id who is placing the order!"]

},
paymentType:{
   type:String,
   default:"cod"
},

deliveredAt:Date,
createdAt:{type:Date,default:Date.now}
  

  

    
})
// ============================================================
//                  Defining Methods of Schemas
// ============================================================
// ========================================
//              User Schema Methods
// ========================================
//password hashing
userSchema.methods.hashPassword = async function() {
    try
    {

        const user = this;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

    }
    catch(err)
    {
        console.log(err);

        
    }
  };

// Instance method to compare passwords
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };


// JWT token generator
userSchema.methods.generateJWT_Token =  function()
{
       
 const newToken = JWT.sign({
    _id:this._id,    
   },process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_TOKEN_LOGIN_EXPIRE_TIME});
   this.tokens.push(newToken);
   return newToken;
  

}
// Manage Tokens
userSchema.methods.tokenManager =  function(token,purpose)
{
    if(!token){return false};
    if(purpose==="a")
        {
            
            this.tokens.push(token);
            return true;

        }
    if(purpose==="d")
        {
            const copyTokens = [...this.tokens];
            const tokenIndex = copyTokens.indexOf(token);
            if(tokenIndex === -1){return false};

            copyTokens.splice(tokenIndex,1);
            this.tokens = [...copyTokens];
            return true;

        }
        

}
// pre methods
userSchema.pre("save",async function(next){
    try
    {

        if(this.isModified("password") || this.isNew)
            {
                await this.hashPassword();
                next();
            }
        }
        catch(err)
        {
            console.log(err);
            next(new ErrorHandlerClass("Password Hashing causing problem!"));

        }
})


// ============================================================
//                  Exporting Schemas
// ============================================================


export {
WebsiteSettingSchema,
    productSchema,
    userSchema,
    productReviewsSchema


}