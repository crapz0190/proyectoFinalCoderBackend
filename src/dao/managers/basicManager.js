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
      console.error(error.message);
    }
  }
  async getById(id) {
    try {
      const response = await this.model
        .findById(id)
        .populate(this.populateProps);
      return response;
    } catch (error) {
      console.error(error.message);
    }
  }
  async createOne(obj) {
    try {
      const response = await this.model.create(obj);
      return response;
    } catch (error) {
      console.error(error.message);
    }
  }
  async updateOne(id, obj) {
    try {
      const response = await this.model.findByIdAndUpdate(id, obj);
      return response;
    } catch (error) {
      console.error(error.message);
    }
  }
  async deleteOne(id) {
    try {
      const response = await this.model.findByIdAndDelete(id);
      return response;
    } catch (error) {
      console.error(error.message);
    }
  }
}
