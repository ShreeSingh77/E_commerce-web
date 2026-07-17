import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        fullName:{
            type:String,
             required: true,
             trim: true,
     },

     username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
     },

     email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      },

      avatar:{
        type:String,
        default:""
      },

     password: {
      type: String,
      required: true,
     },

     coverImage:{
      type:String,
      default:""
     },

     role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
     },

     refreshToken: {
      type: String,
     },

  },
  {
    timestamps: true,
  }
           
);
 
//  hashing password

userSchema.pre("save",async function (){
    if(!this.isModified("password"))
        return;

    this.password =await bcrypt.hash(this.password,10);
    
});

//login then compare  password

userSchema.methods.isPasswordCorrect =async function (password) {
    return await bcrypt.compare(password,this.password);   
};

// access token method

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        role:this.role
    },
   process.env.ACCESS_TOKEN_SECRET,
   {
    expiresIn:
    process.env.ACCESS_TOKEN_EXPIRY,
   }

);
};

// Refresh token method


userSchema.methods.generateRefreshToken =function(){
    return jwt.sign({
        _id:this._id,
    },
process.env.REFRESH_TOKEN_SECRET,
{
    expiresIn:
    process.env.REFRESH_TOKEN_EXPIRY,
}

);
};

export const User =mongoose.model("User",userSchema);
