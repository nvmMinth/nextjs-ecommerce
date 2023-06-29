import React, { useEffect, useReducer } from "react";
import Layout from "../../../components/Layout";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { getError } from "../../../utils/error";
import { toast } from "react-toastify";
import Link from "next/link";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    // fetch product info input
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    // update edited info
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, errorUpdate: "" };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    // upload product image
    case "IMGLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "IMGLOAD_SUCCESS":
      return { ...state, loadingUpload: false, errorUpload: "" };
    case "IMGLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};
const AdminProductEdit = () => {
  // router
  const router = useRouter();
  const productId = router.query.id;
  // useForm
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  //useReducer
  const initialState = {
    loading: true,
    error: "",
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  ////=> state: loading, error, loadingUpdate, loadingUpload
  // useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `/api/admin/products-summary/${productId}`
        );
        dispatch({ type: "FETCH_SUCCESS" });
        setValue("name", data.name);
        setValue("slug", data.slug);
        setValue("price", data.price);
        setValue("brand", data.brand);
        setValue("category", data.category);
        setValue("description", data.description);
        setValue("countInStock", data.countInStock);
        setValue("image", data.image);
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
        toast.error("Fail to fetch product data");
      }
    };
    fetchData();
  }, [productId, setValue]);

  // handle submitHandler
  const submitHandler = async ({
    name,
    slug,
    price,
    brand,
    category,
    description,
    countInStock,
    image,
  }) => {
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(`/api/admin/products-summary/${productId}`, {
        name,
        slug,
        price,
        brand,
        category,
        description,
        countInStock,
        image,
      });
      dispatch({ type: "UPDATE_SUCCESS" });
      toast.success("Product info updated successfully");
      router.push("/admin/products");
    } catch (error) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(error) });
      toast.error(getError(error));
    }
  };
  // handle imgUploadHandler
  const imgUploadHandler = async (e, image) => {
    const url = `https://api.cloudinary.com/v1_1/dpyv86gvd/upload`;
    try {
      dispatch({ type: "IMGLOAD_REQUEST" });
      const {
        data: { signature, timestamp },
      } = await axios("/api/admin/cloudinary");

      const file = e.target.files[0];
      const formData = new FormData();

      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("api_key", process.env.CLOUDINARY_API_KEY);

      const { postData } = await axios.post(url, formData);
      dispatch({ type: "IMGLOAD_SUCCESS" });
      setValue(image, postData.secure_url);
      toast.success("Upload successfully!");
    } catch (error) {
      dispatch({ type: "IMGLOAD_FAIL", payload: getError(error) });
      toast.error(getError(error));
    }
  };
  return (
    <Layout title="Edit product">
      <div className="grid md:grid-cols-5 md:gap-5">
        <ul>
          <li>
            <Link href="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link href="/admin/orders">Orders</Link>
          </li>
          <li>
            <Link href="/admin/products" className="font-bold">
              Products
            </Link>
          </li>
          <li>
            <Link href="/admin/users">Users</Link>
          </li>
        </ul>
        <div className="md:col-span-4">
          <h1 className="text-xl mb-4">Products summary</h1>
          {state.loading ? (
            <div>Loading...</div>
          ) : state.error ? (
            <div className="alert-error">{state.error}</div>
          ) : (
            <form
              onSubmit={handleSubmit(submitHandler)}
              className="mx-auto max-w-screen-md"
            >
              <h1 className="text-xl mb-4">Edit product {productId}</h1>
              <div className="mb-4">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full"
                  autoFocus
                  {...register("name", { required: "Please enter name" })}
                />
                {errors.name && (
                  <div className="text-red-500">{errors.name.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="name">Slug</label>
                <input
                  type="text"
                  id="slug"
                  className="w-full"
                  {...register("slug", { required: "Please enter slug" })}
                />
                {errors.slug && (
                  <div className="text-red-500">{errors.slug.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">Price</label>
                <input
                  type="text"
                  id="price"
                  className="w-full"
                  {...register("price", { required: "Please enter price" })}
                />
                {errors.price && (
                  <div className="text-red-500">{errors.price.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  id="category"
                  className="w-full"
                  {...register("category", {
                    required: "Please enter category",
                  })}
                />
                {errors.category && (
                  <div className="text-red-500">{errors.category.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  id="brand"
                  className="w-full"
                  {...register("brand", {
                    required: "Please enter brand",
                  })}
                />
                {errors.brand && (
                  <div className="text-red-500">{errors.brand.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  className="w-full"
                  {...register("description", {
                    required: "Please enter description",
                  })}
                />
                {errors.description && (
                  <div className="text-red-500">
                    {errors.description.message}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="countInStock">Count in stock</label>
                <input
                  type="text"
                  id="countInStock"
                  className="w-full"
                  {...register("countInStock", {
                    required: "Please enter count in stock",
                  })}
                />
                {errors.countInStock && (
                  <div className="text-red-500">
                    {errors.countInStock.message}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="image">Image</label>
                <input
                  type="text"
                  id="image"
                  className="w-full"
                  {...register("image", {
                    required: "Please enter image",
                  })}
                />
                {errors.image && (
                  <div className="text-red-500">{errors.image.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="imgfile">Upload image</label>
                <input
                  type="file"
                  id="imgfile"
                  className="w-full"
                  onChange={imgUploadHandler}
                />
                {state.loadingUpload && (
                  <div className="text-sm">Uploading...</div>
                )}
              </div>
              <div className="flex items-center justify-between mb-4">
                <Link href="/admin/products">Back</Link>

                <button
                  disabled={state.loadingUpdate}
                  className="primary-button"
                >
                  {state.loadingUpdate ? "Loading" : "Update"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminProductEdit;
AdminProductEdit.auth = { adminOnly: true };
