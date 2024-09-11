module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            answers: {type: String, default: "", required: true},
            history: {type: String, default: "", required: false},
            is_active: {type: Boolean, default: true, required: false},
            is_delete: {type: Boolean, default: false, required: false},
            created_by: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                }
            ],
            form_id: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Survey_Forms",
                    required: true
                }
            ]
        },
        {timestamps: true}
    );
    return mongoose.model("Survey_Forms_Response", schema);
};
