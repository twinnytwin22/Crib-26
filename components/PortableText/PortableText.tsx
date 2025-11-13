import React from "react";

export interface Welcome {
  modules?: Module[];
  _id?: string;
  title?: string;
  image?: null;
  videoUrl?: null;
  description?: null;
  content?: null;
}

export interface Module {
  _id?: string;
  image?: null;
  videoUrl?: null;
  title?: string;
  content?: Content[];
}

export interface Content {
  style?: string;
  _key?: string;
  markDefs?: any[];
  children?: Child[];
  _type?: string;
}

export interface Child {
  _type?: string;
  marks?: any[];
  text?: string;
  _key?: string;
}

export interface PortableTextProps {
  content: Content[];
  shorten?: boolean;
  maxLength?: number;
}

const mapMarkToComponent = (mark: string) => {
  switch (mark) {
    case "em":
      return <em />;
    case "strong":
      return <strong />;
    case "highlight":
      return <span className="highlight" />;
    // Add more cases for other mark definitions as needed
    default:
      return null;
  }
};

export const applyMarksToText = (child: Child) => {
  if (child?.marks && child?.marks.length > 0) {
    let markedText = child.text || "";

    child.marks.forEach((mark) => {
      const markComponent = mapMarkToComponent(mark);
      if (markComponent) {
        markedText = React.cloneElement(
          markComponent,
          { key: mark },
          markedText,
        ) as any;
      }
    });

    return <span key={child?._key}>{markedText}</span>;
  } else {
    return <span key={child?._key}>{child?.text}</span>;
  }
};

const PortableText: React.FC<PortableTextProps> = ({
  content,
  shorten,
  maxLength,
}) => {
  if (shorten) {
    if (maxLength) {
      // Define the maximum character count for truncation
      const shortenedContent = content.map((block, index) => {
        if (block?._type === "block") {
          const paragraphText = block
            ?.children!.map((child) =>
              typeof child === "string"
                ? child
                : applyMarksToText(child).props.children,
            )
            .join("");

          const truncatedText =
            paragraphText.length > maxLength
              ? `${paragraphText.slice(0, maxLength)}...`
              : paragraphText;

          return <p key={index}>{truncatedText}</p>;
        }
        return null;
      });

      return <div>{shortenedContent}</div>;
    }
  }

  return (
    <div>
      {content?.map((block, index) => {
        if (block?._type === "block") {
          return (
            <p key={index}>
              {block?.children?.map((child, childIndex) => {
                if (typeof child === "string") {
                  return child; // Plain text
                } else {
                  return applyMarksToText(child);
                }
              })}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
};

export default PortableText;
