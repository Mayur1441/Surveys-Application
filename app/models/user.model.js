module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            firstname: {type: String, default: '', required: true},
            lastname: {type: String, default: '', required: false},
            username: {type: String, required: false},
            email: {type: String, default: '', required: true},
            mobile: {type: String, default: '', required: true},
            password: {type: String, required: true},
            roles: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Role",
                    required: true
                }
            ]
        },
        {timestamps: true}
    );
    schema.method("toJSON", function () {
        const {__v, _id, ...object} = this.toObject();
        object.id = _id;
        return object;
    });
    const User = mongoose.model("User", schema);
    return User;
};
