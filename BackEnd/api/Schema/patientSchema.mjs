import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
    {
        phoneNumber : {type: Number, require: true},
        aadharNumber : {type: Number, require: true},
        password: {type: String, require: true},
        patientName : {type: String, require: true},
        email: {type: String, require: true},
        lang1 : {type: String, require: true},
        lang2: {type: String, require: false},
        lang3: {type: String, require: false},
        totalIncome: {type: String, require: true},
        AudioLogist: {type: Boolean, require: true},
        SLPathologist: {type: Boolean, require: true}
    },
    {versionKey: false}
)

const patientModel = mongoose.model('patients', patientSchema);

export default patientModel;