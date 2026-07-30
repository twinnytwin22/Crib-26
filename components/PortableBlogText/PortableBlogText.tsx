import React from "react";
import { applyMarksToText, Child, PortableTextProps } from "../PortableText/PortableText";

export const PortableBlogText: React.FC<PortableTextProps> = ({ content }) => {
  // Helper function to group consecutive list items
  const groupListItems = (blocks: any[]) => {
    const grouped: any[] = [];
    let currentList: any[] = [];
    let currentListType: string | null = null;

    blocks?.forEach((block) => {
      if (block?.listItem) {
        const listType = block.listItem; // 'bullet' or 'number'
        
        if (currentListType === listType) {
          currentList.push(block);
        } else {
          if (currentList.length > 0) {
            grouped.push({ type: 'list', listType: currentListType, items: currentList });
            currentList = [];
          }
          currentListType = listType;
          currentList.push(block);
        }
      } else {
        if (currentList.length > 0) {
          grouped.push({ type: 'list', listType: currentListType, items: currentList });
          currentList = [];
          currentListType = null;
        }
        grouped.push(block);
      }
    });

    if (currentList.length > 0) {
      grouped.push({ type: 'list', listType: currentListType, items: currentList });
    }

    return grouped;
  };

  const renderListItem = (item: any, index: number) => {
    return (
      <li key={index} className="ml-6 mb-2">
        {item?.children?.map((child: any, childIndex: number) => {
          if (typeof child === "string") {
            return <span key={childIndex}>{child}</span>;
          } else if (child && typeof child === "object" && "_type" in child) {
            return applyMarksToText(child as Child);
          }
          return null;
        })}
      </li>
    );
  };

  const groupedContent = groupListItems(content);

  return (
    <div className="blog-content">
      {groupedContent?.map((block, index) => {
        // Handle grouped lists
        if (block?.type === 'list') {
          const ListTag = block.listType === 'number' ? 'ol' : 'ul';
          const listClassName = block.listType === 'number' 
            ? "list-decimal list-outside mb-6 text-lg leading-relaxed"
            : "list-disc list-outside mb-6 text-lg leading-relaxed";
          
          return (
            <ListTag key={index} className={listClassName}>
              {block.items.map((item: any, itemIndex: number) => renderListItem(item, itemIndex))}
            </ListTag>
          );
        }

        // Handle regular blocks
        if (block?._type === "block") {
          const style = block?.style || "normal";
          
          // Handle different block styles
          switch (style) {
            case "h2":
              return (
                <h2 key={index} className="text-3xl font-bold mt-12 mb-6">
                  {block?.children?.map((child: Child | string, childIndex: number) => {
                    if (typeof child === "string") {
                      return <span className="font-bold" key={childIndex}>{child}</span>;
                    } else {
                      return applyMarksToText(child);
                    }
                  })}
                </h2>
              );
            case "h3":
              return (
                <h3 key={index} className="text-2xl font-bold  mt-8 mb-4">
                  {block?.children?.map((child: Child | string, childIndex: number) => {
                    if (typeof child === "string") {
                      return <span className="font-bold" key={childIndex}>{child}</span>;
                    } else {
                      return applyMarksToText(child);
                    }
                  })}
                </h3>
              );
            case "h4":
              return (
                <h4 key={index} className="text-xl font-bold mt-6 mb-3">
                  <b>
                  {block?.children?.map((child: Child | string, childIndex: number) => {
                    if (typeof child === "string") {
                      return <span className="font-bold" key={childIndex}>{child}</span>;
                    } else {
                      return applyMarksToText(child);
                    }
                  })}
                  </b>
                </h4>
              );
            case "blockquote":
              return (
                <blockquote key={index} className="border-l-4 border-red-500 bg-slate-50 dark:bg-slate-900 py-4 px-6 my-6 rounded-r-lg">
                  <p className="text-lg  italic">
                    {block?.children?.map((child: Child | string, childIndex: number) => {
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
                  {block?.children?.map((child: Child | string, childIndex: number) => {
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
