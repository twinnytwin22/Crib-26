"use server";
import { supabaseAdmin } from "@/lib/providers/supabase/supabase-lib-admin";
import { cookies } from "next/headers";
import { v4 as uuid } from "uuid";

const host =
  process?.env.NODE_ENV === "development" ? "localhost:3000" : "cribnetwork.io";
const protocol = process?.env.NODE_ENV === "development" ? "http" : "https";

type FetchTypes = {
  // contractAddress?: string;
  // slug?: string;
  userId: string;
};

export const getSiteImage = async (image: string) => {
  const baseUrl = `${process.env
    .SUPABASE_URL!}/storage/v1/object/public/site_images`;
  const imageUrl = baseUrl + image;
  return imageUrl;
};

const refreshCache = async () => {
  try {
    const res = await fetch("/api/v1/refreshCache");
    const data = await res.json();
    if (data) {
      return data;
    }
  } catch (error) {
    return error;
  }
};

const fetchUserEnrollments = async ({ userId }: FetchTypes) => {
  if (userId) {
    try {
      //  await fetch(`${protocol}://${host}/api/v1/getCollectibles`);
      const res = await fetch(
        `${protocol}://${host}/api/v1/getUserCourses?userId=${userId}`,
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));
      //  return await res.json()
      return await res.json();
    } catch (error) {
      console.log(error);
      return error;
    }
  }
};

const fetchCreators = async () => {
  try {
    await fetch(`${protocol}://${host}//api/v1/getCollectibles`);
    const res = await fetch(`${protocol}://${host}//api/v1/getAllCreators`);
    const data = res.json();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    //  return await res.json()
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const fetchProfilesForDrops = async (id: any) => {
 (await cookies()).set("test-cookie", "subport");

  try {
    let res = await fetch(
      `${protocol}://${host}//api/v1/getProfilesForDrops?userId=${id}`,
    );
    const data = await res.json();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    //  return await res.json()
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const fetchProfileForEvent = async (id: any) => {
  try {
    let res = await fetch(
      `${protocol}://${host}//api/v1/getProfileForEvent?userId=${id}`,
    );
    const data = await res.json();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    //  return await res.json()
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getAllArtists = async () => {
  try {
    const res = await fetch(
      `${protocol}://${host}/api/v1/music/getAllArtists/`,
      {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*"
        },

        //  mode: 'no-cors',
      },
    );

    if (res) {
      const artists = await res.json();

      //const data = songs.json()
      return artists;
    }
  } catch (error) {
    throw error;
  }
};
export const getAllPlaylists = async () => {
  try {
    const res = await fetch(
      `${protocol}://${host}/api/v1/music/getAllPlaylists/`,
      {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*"
        },

        //  mode: 'no-cors',
      },
    );

    if (res.ok) {
      const playlists = await res.json();

      //const data = playlists.json()
      return playlists;
    }
  } catch (error) {
    throw error;
  }
};
export const getAllSongs = async () => {
  try {
    const res = await fetch(`${protocol}://${host}/api/v1/music/getAllSongs/`, {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "*"
      },

      //  mode: 'no-cors',
    });

    if (res) {
      const songs = await res.json();

      //const data = songs.json()
      return songs;
    }
  } catch (error) {
    throw error;
  }
};

export const addMewArtist = async ({ updates }: any) => {
  try {
    const res = await fetch(`${protocol}://${host}/api/v1/music/addNewArtist`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": JSON.stringify(updates).length.toString(),

        // "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ updates }),

      //  mode: 'no-cors',
    });

    if (res.ok) {
      const artist = await res.json();

      //const data = songs.json()
      return artist;
    }
  } catch (error) {
    throw error;
  }
};

export const addMewSong = async ({ updates }: any) => {
  try {
    const res = await fetch(`${protocol}://${host}/api/v1/music/addNewSong`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": JSON.stringify(updates).length.toString(),

        // "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ updates }),

      //  mode: 'no-cors',
    });

    if (res.ok) {
      const song = await res.json();

      //const data = songs.json()
      return song;
    }
  } catch (error) {
    throw error;
  }
};

export async function downloadItem({
  path,
  bucket,
}: {
  path: string;
  bucket: string;
}) {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .download(path);
    if (error) {
      throw error;
    }

    const url = URL.createObjectURL(data);
    return url;
  } catch (error) {
    console.log("Error downloading image: ", error);
  }
}

export const uploadFile = async ({
  event,
  bucket,
}: {
  event: any;
  bucket: string;
}) => {
  try {
    if (!event.target.files || event.target.files.length === 0) {
      throw new Error("You must select an image to upload.");
    }
    const uid = uuid();
    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const filePath = `${uid}.${fileExt}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    return filePath;
  } catch (error) {
    alert(JSON.stringify(error));
  } finally {
    //setUploading(false)
  }
};

export {
  fetchCreators, fetchProfileForEvent, fetchProfilesForDrops, fetchUserEnrollments,
  refreshCache
};

