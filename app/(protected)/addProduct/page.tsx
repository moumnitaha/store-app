"use client";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type Product = {
  title: string;
  description: string;
  quantity: number;
  rate: number;
  price: number;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  category: string;
  images?: string[];
};

function addProduct() {
  const router = useRouter();
  const [enabled, setEnabled] = useState(true);
  const [formData, setFormData] = useState<Product>({
    title: "",
    description: "",
    quantity: 0,
    rate: 0,
    price: 0,
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    category: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newproduct: Product = {
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price),
        quantity: parseInt(formData.quantity),
        rate: parseInt(formData.rate),
        images: [
          formData.image1,
          formData.image2,
          formData.image3,
          formData.image4,
        ],
        category: formData.category,
      };
      console.log(newproduct);
      const response = await axios.post("/api/addproduct", {
        product: newproduct,
      });
      if (response.status === 200) {
        console.log("Product add successfully");
        toast.success("Product add successfully");
        console.log(response.data);
        setEnabled(false);
        setTimeout(() => {
          router.push(`/product/${response.data.id}`);
        }, 2000);
        // setProduct(response.data.product);
      } else {
        toast.error("Error adding product");
      }
    } catch (error) {
      console.error("Error:", error.response.data.error);
      if (typeof error.response.data.error === "object") {
        error.response.data.error.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error(error.response.data.error);
      }
    }
    // setShowModal(false);
  };

  const handleImage = (e, index) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    if (!file) return;
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (index === 1) {
        setFormData({ ...formData, image1: reader.result });
      } else if (index === 2) {
        setFormData({ ...formData, image2: reader.result });
      } else if (index === 3) {
        setFormData({ ...formData, image3: reader.result });
      } else if (index === 4) {
        setFormData({ ...formData, image4: reader.result });
      }
      console.log("Image uploaded successfully to: ", index);
    };
  };

  return (
    <section className="flex flex-col items-start justify-start min-w-fit max-w-svw min-h-svh h-fit pl-60 bg-[#f9f9f9]">
      <span className="text-2xl font-bold text-gray-800 m-4 font-poppins">
        <PlusCircleIcon className="h-8 w-8 fill-blue-500 text-white inline-block mr-4" />
        Add Product
      </span>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col p-6 w-[calc(50svw)]"
      >
        <label className="text-lg font-semibold px-2">Title</label>
        <input
          name="title"
          type="text"
          className="p-2 m-2 border-2 border-gray-300 rounded-lg"
          value={formData.title}
          onChange={handleChange}
          placeholder="Example: Black hoodie with stripes"
        />
        <label className="text-lg font-semibold px-2">Description</label>
        <textarea
          name="description"
          className="p-2 border-2 border-gray-300 ml-2 mt-2 mr-2 rounded-lg min-h-32"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description must be between 100 and 500 characters"
        />
        <p className="text-red-500 text-sm mb-2 ml-2">
          {formData.description.length &&
          (formData.description.length < 100 ||
            formData.description.length > 500)
            ? "Description must be between 100 and 500 characters"
            : " "}
        </p>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col flex-1">
            <label className="text-lg font-semibold px-2">Price</label>
            <input
              name="price"
              type="number"
              min={0}
              max={100_000}
              className="p-2 m-2 border-2 border-gray-300 rounded-lg"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-lg font-semibold px-2">Quantity</label>
            <input
              name="quantity"
              type="number"
              min={0}
              max={1_000}
              className="p-2 m-2 border-2 border-gray-300 rounded-lg"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col flex-1">
            <label className="text-lg font-semibold px-2">Rate</label>
            <input
              name="rate"
              type="number"
              min={0}
              max={5}
              className="p-2 m-2 border-2 border-gray-300 rounded-lg"
              value={formData.rate}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col flex-1">
            <label className="text-lg font-semibold px-2">Category</label>
            <select
              name="category"
              className="p-2 m-2 border-2 border-gray-300 rounded-lg"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              <option value="Clothes">Clothes</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Shoes">Shoes</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>
        </div>
        <label className="text-lg font-semibold px-2">Images</label>
        {/* <input
			name="images"
			type="file"
			accept="image/png, image/jpeg, image/jpg"
			className="p-2 m-6 border-2 border-gray-300 rounded-lg"
			onChange={handleImage}
		  /> */}
        <div className="flex flex-row items-center justify-between h-54 mb-5">
          {[1, 2, 3, 4].map((item, index) => {
            return (
              <div
                key={index}
                className="w-1/4 m-1 flex justify-center items-center"
              >
                <label
                  htmlFor={`image${item}`}
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer max-w-52 max-h-52 w-full aspect-square relative p-4 border-2 border-dashed border-gray-300 rounded-md"
                >
                  {[
                    formData.image1,
                    formData.image2,
                    formData.image3,
                    formData.image4,
                  ][index] ? (
                    <img
                      src={
                        [
                          formData.image1,
                          formData.image2,
                          formData.image3,
                          formData.image4,
                        ][index]
                      }
                      alt="product"
                      className="w-full h-full rounded-lg object-conatin aspect-square"
                    />
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 fill-white stroke-blue-500"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="text-gray-600 font-medium">
                        Upload image
                      </span>
                    </>
                  )}
                </label>
                <input
                  id={`image${item}`}
                  name={`image${item}`}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  onChange={(e) => handleImage(e, item)}
                />
              </div>
            );
          })}
        </div>
        {/*footer*/}
        <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
          <button
            disabled={!enabled}
            className="w-48 p-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 text-center disabled:bg-gray-500 disabled:cursor-not-allowed"
            type="submit"
            //   onClick={() => setShowModal(false)}
          >
            ADD PRODUCT
          </button>
        </div>
      </form>
    </section>
  );
}

export default addProduct;
