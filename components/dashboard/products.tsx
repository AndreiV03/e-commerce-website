import { useState } from "react";

import ProductsService from "../../services/products-service";
import APIs from "../../services/apis";
import Handlers from "../../utils/handlers";
import Helpers from "../../utils/helpers";
import type { ProductFormDataInterface as FormData } from "../../interfaces/products-interfaces";
import type { ProductsPropsInterface as PropsInterface } from "../../interfaces";

import styles from "../../styles/pages/settings.module.scss";
import SelectInput from "../select-input";

const formDataInitialState: FormData = {
  sku: "",
  name: "",
  description: "",
  price: "",
  category: ""
};

const Products: React.FC<PropsInterface> = ({ token, categories }) => {
  const [formData, setFormData] = useState<FormData>(formDataInitialState);
  const [file, setFile] = useState<File>({} as File);

  const handleFormValidity = () => {
    if (!formData.sku || !formData.name || !formData.description || !formData.price) return true;
    if (!file.name || file.size > 1024 * 1024) return true;
    return false;
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      let data;
      ({ data } = await APIs.googleDriveUpload(token, file));
      ({ data } = await ProductsService.createProduct(token, formData, data));

      setFormData(formDataInitialState);
      setFile({} as File);
      alert(data.message);
    } catch (error: any) {
      return alert(error.response.data.message);
    }
  }

  return (
    <div className={styles.content}>
      <div className={styles.section}>
        <h3>Create product</h3>
        <p>From here you can create new products.</p>

        <form onSubmit={handleFormSubmit} autoComplete="off">
          <div className={styles.file}>
            <input type="file" id="file" onChange={event => Handlers.handleFileUpload(event, setFile)} />
            <div className={styles.container}>
              <label htmlFor="file" className={`${file.type ? styles.extension : ""} ${file.size > 1024 * 1024 ? styles.error : ""}`}>
                {file.type && <span>{file.type === "image/png" ? "png" : "jpg"}</span>}
              </label>
              <div className={styles.details}>
                <h3>{file.name ? Helpers.shortenFileName(file.name) : "No file"}</h3>
                <h4>{file.size ? Helpers.formatFileSize(file.size) : ""}{file.size > 1024 * 1024 ? <span> (too big)</span> : ""}</h4>
              </div>
            </div>
          </div>

          <div className={styles.field}>
            <input type="text" id="sku" name="sku" placeholder=" "
              value={formData.sku} onChange={event => Handlers.handleFormDataChange(event, setFormData)} />
            <label htmlFor="sku">SKU (stock keeping unit)</label>
          </div>

          <div className={styles.field}>
            <input type="text" id="name" name="name" placeholder=" "
              value={formData.name} onChange={event => Handlers.handleFormDataChange(event, setFormData)} />
            <label htmlFor="name">Name</label>
          </div>

          <div className={`${styles.field} ${styles.textarea}`}>
            <textarea id="description" name="description" placeholder=" "
              value={formData.description} onChange={event => Handlers.handleFormDataChange(event, setFormData)} />
            <label htmlFor="description">Description</label>
          </div>
          
          <SelectInput styles={styles} options={categories} name="category" value={formData.category} setState={setFormData} />

          <div className={styles.field}>
            <input type="number" id="price" name="price" placeholder=" "
              value={formData.price} onChange={event => Handlers.handleFormDataChange(event, setFormData)} />
            <label htmlFor="price">Price</label>
          </div>

          <button type="submit" disabled={handleFormValidity()}>Create</button>
        </form>
      </div>
    </div>
  );
}

export default Products;