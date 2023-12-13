export default class BasicManager {
  constructor(model, populateProps) {
    this.model = model;
    this.populateProps = populateProps;
  }
  async getAll() {
    try {
      const response = await this.model.find();
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  async getById(id) {
    try {
      const response = await this.model
        .findById(id)
        .populate(this.populateProps);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  async createOne(obj) {
    try {
      const response = await this.model.create(obj);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  async updateOne(id, obj) {
    console.log("Intentando eliminar producto con ID:", id);
    try {
      const response = await this.model.findByIdAndUpdate(id, obj);
      console.log("Producto eliminado:", response);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
  async deleteOne(id) {
    try {
      const response = await this.model.findByIdAndDelete(id);
      return response;
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar el documento");
    }
  }
}
