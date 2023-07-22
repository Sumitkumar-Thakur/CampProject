import mongoose from "mongoose";
import PassportLocalMongoose  from "passport-local-mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})
UserSchema.plugin(PassportLocalMongoose);

export default mongoose.model('User', UserSchema);