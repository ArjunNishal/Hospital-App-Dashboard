import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build";
import React, { useState } from "react";

const CkeditorComponent = ({
  content,
  setcontent,
  setuploadedImagesarr,
  uploadedImagesarr,
}) => {
  const [Editorr, setEditorr] = useState(null);
//   const [uploadedImages, setuploadedImages] = useState([]);
//   const [uploadedImagesarr, setuploadedImagesarr] = useState([]);

  const replaceImageUrls = (content, urls) => {
    let updatedContent = content;
    const regex = /src="([^"]*)"/g; // Regular expression to match src attribute values

    let match;
    let index = 0;
    while ((match = regex.exec(updatedContent)) !== null) {
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      if (urls[index]) {
        updatedContent = updatedContent.replace(match[1], urls[index]);
        index++;
      }
    }
    return updatedContent;
  };

  //   const uploadblog = async (updatedContent, newurls) => {
  //     try {
  //       // const imageurlsnew = extractImageUrls(updatedContent);
  //       console.log(newurls, "newurls..............................");
  //       const blogaData = new FormData();
  //       blogaData.append("content", updatedContent);
  //       blogaData.append("week", week);
  //       blogaData.append("title", title);
  //       blogaData.append("image", babyimage);
  //       blogaData.append("uploadedImages", newurls);
  //       // uploadedImages
  //       blogaData.append(
  //         "admin",
  //         decoded.role === "admin" || decoded.role === "superadmin"
  //           ? decoded.id
  //           : decoded.adminId
  //       );
  //       blogaData.append(
  //         "createdby",
  //         decoded.role === "admin" || decoded.role === "superadmin"
  //           ? decoded.id
  //           : decoded.adminId
  //       );

  //       // console.log(uploadedImages, "uploadedImages");

  //       const response = await axiosInstance.post("blog/create/blog", blogaData, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       Swal.fire({
  //         icon: "success",
  //         title: "Blog Created successfully",
  //         text: "You have successfully Created Blog.",
  //       });

  //       navigate("/blogs");
  //     } catch (error) {
  //       console.log(error);
  //       Swal.fire({
  //         icon: "error",
  //         title: "Blog Creation Failed",
  //         text: error.response.data.message,
  //       });
  //     }
  //   };

  console.log(content, "content of the article");

  function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader, setuploadedImagesarr);
    };
  }

  class MyUploadAdapter {
    constructor(loader, setuploadedImagesarr) {
      this.loader = loader;
      this.setuploadedImagesarr = setuploadedImagesarr;
    }

    async upload() {
      const file = await this.loader.file;
      // const formData = new FormData();
      // formData.append("file", file);

      try {
        // const response = await axiosInstance.post("/upload/image", formData, {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        // });
        const url = URL.createObjectURL(file);
        console.log(file, url, "555555555555555555555555555555555");
        // const url = response.data.url;
        this.setuploadedImagesarr((prev) => [...prev, file]);
        return { default: url };
      } catch (error) {
        console.error("Upload failed:", error);
        throw error;
      }
    }

    abort() {
      // Abort the upload process if necessary.
    }
  }
  return (
    <CKEditor
      editor={Editor}
      data={content}
      onChange={(event, editor) => {
        const data = editor.getData();
        // console.log(editor, data, "editor data");
        setcontent(data);
        setEditorr(editor);
      }}
      style={{ width: "100%" }}
      config={{
        extraPlugins: [MyCustomUploadAdapterPlugin],
        height: "300px",
      }}
    />
  );
};

export default CkeditorComponent;
