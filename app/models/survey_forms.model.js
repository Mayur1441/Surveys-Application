module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            title: {type: String, default: '', required: true},
            questions: {type: String, default: '', required: true},
            is_active: {type: Boolean, default: true, required: false},
            is_delete: {type: Boolean, default: false, required: false},
            created_by: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    default: "66dfe639935a4bed2363bc72",
                    ref: "User",
                    required: true
                }
            ],
            shared_to: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    default: "66dfe639935a4bed2363bc72",
                    ref: "User",
                    required: true
                }
            ]
        },
        {timestamps: true}
    );
    schema.pre('save', function (next) {
        // this.created_by == null ? this.created_by = '66dfe639935a4bed2363bc72' : null
        // this.shared_to == null ? this.shared_to = '' : null
        next()
    })

    return mongoose.model("Survey_Forms", schema);
};
