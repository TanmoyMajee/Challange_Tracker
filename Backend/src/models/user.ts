import mongoose  from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema({
    name : {
      type : String ,
      required : true
    },
    email : {
      type : String,
      unique : true,
      required : true
    },
    password : {
      type: String,
      required: true
    },
    role : {
      type  : String,
      enum: ['user', 'admin'], 
      default: 'user'
    }  
},{timestamps:true});

export const UserModel = mongoose.model('Task_User',UserSchema);

