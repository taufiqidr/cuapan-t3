import { supabase } from "./supabase";

export const uploadPic = async (image_name: string, imageFile: File) => {
  await supabase.storage
    .from("cuapan-image")
    .upload("user/" + image_name, imageFile as File);
};

export const uploadStatusPic = async (image_name: string, imageFile: File) => {
  await supabase.storage
    .from("cuapan-image")
    .upload("status/" + image_name, imageFile as File);
};

export const deletePic = async (old_image: string | null | undefined) => {
  await supabase.storage.from("cuapan-image").remove(["user/" + old_image]);
};

export const uploadCoverPic = async (
  coverImage_name: string,
  coverImageFile: File
) => {
  await supabase.storage
    .from("cuapan-image")
    .upload("user/" + coverImage_name, coverImageFile as File);
};

export const deleteCoverPic = async (
  old_coverImage: string | null | undefined
) => {
  await supabase.storage
    .from("cuapan-image")
    .remove(["user/" + old_coverImage]);
};
