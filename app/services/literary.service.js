const { ObjectId } = require("mongodb");

class LiteraryService {
    constructor(client) {
        this.literary = client.db().collection("literary");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractLiteraryData(payload) {
        const literary = {
            name: payload.name,
            author: payload.author,
            address: payload.address,
            year: payload.year,
            describe: payload.describe,
            brief: payload.brief,
            favorite: payload.favorite,
        };
        // Remove undefined fields
        Object.keys(literary).forEach(
            (key) => literary[key] === undefined && delete literary[key]
        );
        return literary
    }
    async create(payload) {
        const literary = this.extractLiteraryData(payload);
        const result = await this.literary.findOneAndUpdate(
            literary,
            { $set: { favorite: literary.favorite === true } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }
    async find(filter) {
        const cursor = await this.literary.find(filter);
        return await cursor.toArray();
    }
    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }
    async findById(id){
        return await this.literary.findOne({
            _id: ObjectId.isValid(id)? new ObjectId(id) : null,
        });
    }
    async update(id, payload) {
        const filter = {
         _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractLiteraryData(payload);
        const result = await this.literary.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }
    async delete(id) {
        const result = await this.literary.findOneAndDelete({
             _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }
    async findFavorite(){
        return await this.find({ favorite: true});
    }   
    async deleteAll(){
        const result = await this.literary.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = LiteraryService;