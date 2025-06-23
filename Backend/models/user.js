import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Counter Schema for UID Auto-Increment
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 75604 }, // Set to 75604 so first user gets 75605
});
const Counter = mongoose.model("Counter", counterSchema);

// User Schema with Auto-Increment UID
const userSchema = new mongoose.Schema({
    uid: { type: Number, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    invitationCode: { type: String, required: true },
    balance: { type: Number, default: 0 },
    vipLevel: { type: Number, default: 1 },
});

// Auto-increment UID and hash password before saving
userSchema.pre("save", async function (next) {
    if (this.isNew) {
        try {
            let counter = await Counter.findOne({ _id: "userId" });
            if (!counter) {
                // Create the counter with the desired starting value
                counter = await Counter.create({ _id: "userId", seq: 75604 });
            }
            counter = await Counter.findOneAndUpdate(
                { _id: "userId" },
                { $inc: { seq: 1 } },
                { new: true }
            );
            this.uid = counter.seq;
        } catch (error) {
            return next(error);
        }
    }

    // Hash the password before saving
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
});

const User = mongoose.model("User", userSchema);

export default User;