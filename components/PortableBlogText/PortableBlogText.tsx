import React from "react";
import { applyMarksToText, PortableTextProps } from "../PortableText/PortableText";

export const PortableBlogText: React.FC<PortableTextProps> = ({ content }) => {
  return (
    <div className="blog-content">
      {content?.map((block, index) => {
        if (block?._type === "block") {
          const style = block?.style || "normal";
          
          // Handle different block styles
          switch (style) {
            case "h2":
              return (
                <h2 key={index} className="text-3xl font-bold mt-12 mb-6">
                  {block?.children?.map((child, childIndex) => {
                    if (typeof child === "string") {
                      return <span key={childIndex}>{child}</span>;
                    } else {
                      return applyMarksToText(child);
                    }
                  })}
                </h2>
              );
            case "h3":
              return (
                <h3 key={index} className="text-2xl font-bold  mt-8 mb-4">
                  {block?.children?.map((child, childIndex) => {
                    if (typeof child === "string") {
                      return <span key={childIndex}>{child}</span>;
                    } else {
                      return applyMarksToText(child);
                    }
                  })}
                </h3>
              );
            case "h4":
              return (
                <h4 key={index} className="text-xl font-semibold mt-6 mb-3">
                  {block?.children?.map((child, childIndex) => {
                    if (typeof child === "string") {
                      return <span key={childIndex}>{child}</span>;
                    } else {
                      return applyMarksToText(child);
                    }
                  })}
                </h4>
              );
            case "blockquote":
              return (
                <blockquote key={index} className="border-l-4 border-red-500 bg-slate-50 dark:bg-slate-900 py-4 px-6 my-6 rounded-r-lg">
                  <p className="text-lg  italic">
                    {block?.children?.map((child, childIndex) => {
                      if (typeof child === "string") {
                        return <span key={childIndex}>{child}</span>;
                      } else {
                        return applyMarksToText(child);
                      }
                    })}
                  </p>
                </blockquote>
              );
            default:
              return (
                <p key={index} className="text-lg leading-relaxed mb-6">
                  {block?.children?.map((child, childIndex) => {
                    if (typeof child === "string") {
                      return <span key={childIndex}>{child}</span>;
                    } else {
                      return applyMarksToText(child);
                    }
                  })}
                </p>
              );
          }
        }
        return null;
      })}
    </div>
  );
};

export default PortableBlogText;
