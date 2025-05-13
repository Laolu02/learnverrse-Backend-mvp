import mongoose from 'mongoose';

const tempTokenSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 }, // Automatically clears the schema after the expiry time
        },
    },
    { timestamps: true }
);

const TempTokenModel = mongoose.model('TempToken', tempTokenSchema);
export default TempTokenModel;