import { createClient as sanityClient } from "@sanity/client";

const projectId: string =
  process.env.SANITY_PROJECT_ID! || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.SANITY_DATASET || process.env.SANITY_DATASET;
const apiVersion = "2021-10-21";

const config = {
  projectId: "6d8w1e5g",
  dataset,
  apiVersion,
  useCdn: false,
};

const client = sanityClient(config);

const baseUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query`;
const getOptions = {
  method: "GET",
  headers: { "Content-Type": "application/json" },
};

async function fetchSanity(query: string) {
  const res = await fetch(`${baseUrl}=${query}`, getOptions);
  const data = await res.json();
  if (data) {
    return data.result;
  } else {
    throw new Error("Error fetching data");
  }
}

export async function getSiteSettings() {
  const query: string = "*%5B_type%20%3D%3D%20%22siteSettings%22%5D";
  const res = await fetchSanity(query);

  return res[0];
}

export const getCoursesPageSettings = async () => {
  const query: string =
    "*%5B_type%20%3D%3D%20%22page%22%20%26%26%20title%20match%20%22Courses%22%5D%0A";
  const res = await fetchSanity(query);
  return res[0].sections[0].items[0];
};

export async function getBlogPosts() {
  const query: string = "*%5B_type%20%3D%3D%20%22blogPosts%22%5D";
  const res = await fetchSanity(query);
  //  console.log(res)
  const image = res[0].coverImage;
  const imageRes = imageBuilder(image);
  console.log(imageRes, "IMAGE");
  const slugs = res.map(({ slug }: { slug: { current: string } }) => slug.current);
  if (res) {
    return { res: res, slugs, images: imageRes, success: true };
  } else {
    throw new Error();
  }
}

export const getAllCourses = async () => {
  const query: string =
    "*%5B_type%20%3D%3D%20%22course%22%5D%20%7B%0A%20%20_id%2C%0A%20%20title%2C%0A%20%20description%2C%0A%20%20image%2C%0A%20%20lessons%5B%5D-%3E%7B_id%2C%20title%2C%20description%7D%2C%20%2F%2F%20Retrieve%20the%20details%20of%20lessons%0A%20%20categories%5B%5D-%3E%7B_id%2C%20title%7D%20%2F%2F%20Retrieve%20the%20details%20of%20categories%0A%7D%0A";
  const res = await fetchSanity(query);
  return res;
};

export const queryCourseId = async (id: string) => {
  const query = `*[_type == 'course' && _id == $id] {
        _id,
    title,
    description,
    image,
      videoUrl,
    lessons[]->{
      _id, 
      title, 
      image, 
       videoUrl,
      description,
      content,
      overview,
      quizzes[]-> {
        _id,
        title, 
        questions,
      },
      modules[]-> {
        _id,
        image,
        videoUrl,
        title,
       content
        },
     //   markDefs[]->,
       // children[]->,
  //   },
    }, // Retrieve the details of lessons
    categories[]->{_id, title} // Retrieve the details of categories
  }
  
  `;
  const res = await client.fetch(query, { id });
  return res[0];
};

// imageUtils.js

export function imageBuilder(inputString: any) {
  const imageRef = inputString?.asset._ref;
  const parts = imageRef.split("-");
  const imageId = parts.slice(1, -2).join("-"); // Extract the image ID
  const dimensions = parts[parts.length - 2]; // Extract the dimensions
  const extension = parts[parts.length - 1]; // Extract the image extension

  const baseURL = "https://cdn.sanity.io/images/6d8w1e5g/production/";
  const imageURL = `${baseURL}${imageId}-${dimensions}.${extension}`;

  return imageURL;
}

export async function getPageContent() {
  const query: string = "*%5B_type%20%3D%3D%20%22page%22%5D";
  const res = await fetchSanity(query);
  const pages = res;
  const homePage = res[0];
  return { homePage, pages };
}
