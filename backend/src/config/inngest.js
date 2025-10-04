import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "slack-clone" });

// Define the functions
const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" }, // this event name must follows the Clerk doc
  async ({ event }) => {
    await connectDB();

    // unpack data from Clerk
    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address ?? "",
      name: `${first_name || ""} ${last_name || ""}`,
      image: image_url,
    };

    // Let Inngest add user to MongoDB when getting user.created event from Clerk
    await User.create(newUser);

    // We also add user to Stream
    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.image,
    });
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;

    // Let Inngest delete user in MongoDB when getting user.deleted event from Clerk
    await User.deleteOne({ clerkId: id });

    // We also delete user from Stream
    await deleteStreamUser(id.toString());
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUser, deleteUserFromDB];
