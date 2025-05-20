import mongoose, { Document, Schema, Model } from "mongoose";

/**
 * Mongoose schema and model for username documents
 */
interface UsernameDoc extends Document {
    username: string;
    createdAt: Date;
}

const USERNAME_REGEX = /^[A-Za-z0-9_]{1,20}$/;

const UsernameSchema = new Schema<UsernameDoc>({
    username: { type: String, required: true, unique: true, maxlength: 20, match: USERNAME_REGEX },
    createdAt: { type: Date, default: Date.now }
});

const UsernameModel: Model<UsernameDoc> = mongoose.models.Username || mongoose.model<UsernameDoc>("Username", UsernameSchema);

/**
 * Checks if a username is unique in the "usernames" collection.
 * @param usernameToCheck Username to verify
 * @returns true if not found, false if already exists
 */
export async function checkUsernameUniqueness(usernameToCheck: string): Promise<boolean> {
    // Validate format first
    if (!USERNAME_REGEX.test(usernameToCheck)) {
        throw new Error("Invalid username format");
    }
    const exists = await UsernameModel.exists({ username: usernameToCheck });
    return !exists;
}

/**
 * Registers a new username by inserting into the collection.
 * Optionally removes an old username first.
 * @param usernameToRegister Username to insert
 * @param removeOld Boolean flag whether to remove an old username
 * @param oldUsername The old username to delete if removeOld is true
 * @returns true if registration succeeded, false if duplicate prevented it
 */
export async function registerUsername(
    usernameToRegister: string,
    removeOld: boolean = false,
    oldUsername?: string
): Promise<boolean> {
    // Validate format of new username
    if (!USERNAME_REGEX.test(usernameToRegister)) {
        throw new Error("Invalid username format");
    }
    // Optionally delete the old username entry
    if (removeOld && oldUsername) {
        if (!USERNAME_REGEX.test(oldUsername)) {
            throw new Error("Invalid old username format");
        }
        try {
            await UsernameModel.deleteOne({ username: oldUsername });
        } catch (err) {
            console.error("Error deleting old username:", err);
            // proceed even if deletion fails
        }
    }

    // Create the new username entry
    try {
        await UsernameModel.create({ username: usernameToRegister });
        return true;
    } catch (err: any) {
        // Handle duplication error
        if (err.code === 11000) {
            return false;
        }
        // Propagate validation or other errors
        throw err;
    }
}