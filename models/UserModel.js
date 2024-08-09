import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  name: String, 
  email: String,
  password: String,
  lastName: {
    type: String,
    default: "lastName",
  },
  location: {
    type: String,
    default: "my city",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  avatar: {
    type:String, 
    avatarPublicId: String, 

  }
});

UserSchema.methods.noPass = function(){
  let obj = this.toObject() // this is the instance of user in object type 
  // will need to convert back to JSON later when reading it in the controller
  delete obj.password
  return obj;  //this way you can get the user back without the password 

}

export default mongoose.model("User", UserSchema);
