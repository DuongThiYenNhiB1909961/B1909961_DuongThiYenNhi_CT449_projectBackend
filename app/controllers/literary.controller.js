const LiteraryService = require("../services/literary.service");
const MongoDB = require ("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = (req, res) => {
    res.send({message:"create handler"});
};
exports.findAll = (req, res) => {
    res.send({message:"findAll handler"});
};
exports.findOne = (req, res) => {
    res.send({message:"findOne handler"});
};
exports.update = (req, res) => {
    res.send({message:"update handler"});
};
exports.delete = (req, res) => {
    res.send({message:"delete handler"});
};
exports.deleteAll = (req, res) => {
    res.send({message:"deleteAll handler"});
};
exports.findAllFavorite = (req, res) => {
    res.send({message:"findAllFavorite handler"});
};
// Tạo và lưu một tác phẩm văn học mới
exports.create = async (req, res, next) =>{
    if (!req.body?.name){
        return next(new ApiError(400, "Tên không được để trống"));
    }

    try{
        const literaryservice = new LiteraryService(MongoDB.client);
        const document = await literaryservice.create(req.body);
        return res.send(document);    
    } catch (error) {
        return next(
          new ApiError(500, "Đã xảy ra lỗi khi tạo tác phẩm")
        )
    }
};
// Truy xuất tất cả các liên hệ của người dùng từ cơ sở dữ liệu
exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const literaryService = new LiteraryService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await literaryService.findByName(name);
        } else {
            documents = await literaryService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi tạo tác phẩm")
        );
    }

    return res.send(documents);
};
// Tìm liên hệ duy nhất với một id
exports.findOne = async (req, res, next) => {
    try{
        const literaryService = new LiteraryService(MongoDB.client);
        const document = await literaryService.findById(req.params.id);
        if (!document){
            return next(new ApiError(404, "Không tìm thấy tác phẩm"));
        }
        return res.send(document);
    }catch (error){
        return next(
            new ApiError(
                500,
                `Lỗi khi truy xuất tác phẩm với id=${req.params.id}`
            )
        );
    }
}
// Cập nhật một tác phẩm theo id trong yêu cầu
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0){
        return next(new ApiError(400, "Không được để trống dữ liệu cần cập nhật"));
    }
    try{
        const literaryService = new LiteraryService(MongoDB.client);
        const document = await literaryService.update(req.params.id, req.body);
        if(!document){
            return next(new ApiError(404, "Không tìm thấy tác phẩm"));
        }
        return res.send({ message: "Tác phẩm đã được cập nhật thành công"});
    }catch (error){
        return next(
            new ApiError(500, `Lỗi khi cập nhật tác phẩm với id=${req.params.id}`)
        );
    }
};
// Xóa một tác phẩm với id được chỉ định theo yêu cầu
exports.delete = async (req, res, next) => {
    try {
        const literaryService = new LiteraryService(MongoDB.client);
        const document = await literaryService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Không tìm thấy tác phẩm"));
        }
        return res.send({message: "Tác phẩm đã được xóa thành công"});
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Không thể xóa tác phẩm với id=${req.params.id}`
            )
        );
    }
};
// Tìm tất cả các tác phẩm yêu thích của người dùng
exports.findAllFavorite = async (_req, res, next) => {
    try{
        const literaryService = new LiteraryService(MongoDB.client);
        const documents = await literaryService.findFavorite();
        return res.send(documents);
    }catch (error){
        return next(
            new ApiError(
                500,
                "Đã xảy ra lỗi khi truy xuất tác phẩm yêu thích"
            )
        );
    }
};
// Xóa tất cả tác phẩm của người dùng khỏi cơ sở dữ liệu
exports.deleteAll = async (_req, res, next) => {
    try {
        const literaryService = new LiteraryService(MongoDB.client);
        const deletedCount = await literaryService.deleteAll();
        return res.send({
            message: `${deletedCount} Tác phẩm đã được xóa thành công`,
        });
    }catch (error){
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả tác phẩm")
        );
    }
};