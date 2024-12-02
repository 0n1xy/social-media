// import { faker, Sex } from "@faker-js/faker";
// import User from "@/models/UserModel";
// import Post from "@/models/PostModel";
// import Comment from "@/models/CommentModel";
// import mongoose from "mongoose";
// import Like from "@/models/LikeModel";
// import Follow from "@/models/FollowModel";
// import Message from "@/models/MessageModel";
// import Notification from "@/models/NotificationModel";

// //Seeds random user

// const createUser = async () => {
//   const newUser = new User({
//     _id: new mongoose.Types.ObjectId(),
//     username: faker.internet.userName(),
//     password: faker.internet.password(),
//     sex: faker.person.sex(),
//     first_name: faker.person.firstName(),
//     last_name: faker.person.lastName(),
//     phone_number: faker.phone.number({ style: "human" }),
//     birthday: faker.date.birthdate(),
//     email: faker.internet.email(),
//     profile_picture: faker.image.avatar(),
//     biography: faker.person.jobTitle(),
//     created_date: faker.date.between({ from: "2024-09-01", to: Date.now() }),
//     updated_date: Date.now(),
//   });
//   await newUser.save();
// };

// export const createRandomUsers = async (num: number) => {
//   try {
//     for (let i = 0; i <= num; i++) {
//       await createUser();
//       await createPost();
//     }
//     console.log(num + " người dùng đã được tạo thành công!");
//   } catch (error) {
//     console.error("Lỗi khi tạo người dùng:", error);
//   }
// };

// //Seeds random post

// const createPost = async () => {
//   const users = await User.find();
//   if (users.length === 0) {
//     throw new Error("Không có người dùng nào để chọn.");
//   }

//   const randomUser = users[Math.floor(Math.random() * users.length)];

//   const newPost = new Post({
//     _id: new mongoose.Types.ObjectId(),
//     user_id: randomUser._id,
//     post_title: faker.person.jobTitle(),
//     content: faker.person.jobDescriptor(),
//     created_date: faker.date.between({ from: "2024-09-01", to: Date.now() }),
//     updated_date: Date.now(),
//   });
//   await newPost.save();
// };

// export const createRandomPosts = async (num: number) => {
//   try {
//     for (let i = 0; i <= num; i++) {
//       await createPost();
//     }
//     console.log(num + " bài viết đã được tạo thành công!");
//   } catch (error) {
//     console.error("Lỗi khi tạo bài viết:", error);
//   }
// };

// //Seeds random comment

// const createComment = async () => {
//   const users = await User.find();
//   if (users.length === 0) {
//     throw new Error("Không có người dùng nào để chọn.");
//   }
//   const posts = await Post.find();
//   if (users.length === 0) {
//     throw new Error("Không có bài viết nào để chọn.");
//   }

//   const randomUser = users[Math.floor(Math.random() * users.length)];
//   const randomPost = posts[Math.floor(Math.random() * users.length)];

//   const newComment = new Comment({
//     _id: new mongoose.Types.ObjectId(),
//     post_id: randomPost._id,
//     user_id: randomUser._id,
//     comment_text: faker.food.description(),
//     created_date: faker.date.between({ from: "2024-09-01", to: Date.now() }),
//     updated_date: Date.now(),
//   });
//   await newComment.save();
// };

// export const createRandomComments = async (num: number) => {
//   try {
//     for (let i = 0; i <= num; i++) {
//       await createComment();
//     }
//     console.log(num + " bình luận đã được tạo thành công!");
//   } catch (error) {
//     console.error("Lỗi khi tạo bình luận:", error);
//   }
// };

// //Seeds random like

// const createLike = async () => {
//   const users = await User.find();
//   if (users.length === 0) {
//     throw new Error("Không có người dùng nào để chọn.");
//   }
//   const posts = await Post.find();
//   if (users.length === 0) {
//     throw new Error("Không có bài viết nào để chọn.");
//   }

//   const randomUser = users[Math.floor(Math.random() * users.length)];
//   const randomPost = posts[Math.floor(Math.random() * users.length)];

//   const newLike = new Like({
//     _id: new mongoose.Types.ObjectId(),
//     post_id: randomPost._id,
//     user_id: randomUser._id,
//     created_date: faker.date.between({ from: "2024-09-01", to: Date.now() }),
//   });
//   await newLike.save();
// };

// export const createRandomLikes = async (num: number) => {
//   try {
//     for (let i = 0; i <= num; i++) {
//       await createLike();
//     }
//     console.log(num + " lượt thích đã được tạo thành công!");
//   } catch (error) {
//     console.error("Lỗi khi tạo lượt thích:", error);
//   }
// };

// //Seeds random follow

// const createFollow = async () => {
//   const users = await User.find();
//   if (users.length === 0) {
//     throw new Error("Không có người dùng nào để chọn.");
//   }

//   const randomFollower = users[Math.floor(Math.random() * users.length)];
//   const randomFollowed = users[Math.floor(Math.random() * users.length)];

//   const newFollow = new Follow({
//     _id: new mongoose.Types.ObjectId(),
//     follower_id: randomFollower._id,
//     followed_id: randomFollowed._id,
//     created_date: faker.date.between({ from: "2024-09-01", to: Date.now() }),
//   });
//   await newFollow.save();
// };

// export const createRandomFollow = async (num: number) => {
//   try {
//     for (let i = 0; i <= num; i++) {
//       await createFollow();
//     }
//     console.log(num + " lượt theo dõi đã được tạo thành công!");
//   } catch (error) {
//     console.error("Lỗi khi tạo lượt theo dõi:", error);
//   }
// };

// //Seeds random message

// const createMessage = async () => {
//   const users = await User.find();
//   if (users.length === 0) {
//     throw new Error("Không có người dùng nào để chọn.");
//   }

//   const randomSender = users[Math.floor(Math.random() * users.length)];
//   const randomReceiver = users[Math.floor(Math.random() * users.length)];

//   const newMessage = new Message({
//     _id: new mongoose.Types.ObjectId(),
//     sender_id: randomSender._id,
//     receiver_id: randomReceiver._id,
//     message_content: faker.food.dish(),
//     created_date: faker.date.between({ from: "2024-09-01", to: Date.now() }),
//   });
//   await newMessage.save();
// };

// export const createRandomMessages = async (num: number) => {
//   try {
//     for (let i = 0; i <= num; i++) {
//       await createMessage();
//     }
//     console.log(num + " tin nhắn đã được tạo thành công!");
//   } catch (error) {
//     console.error("Lỗi khi tạo tin nhắn:", error);
//   }
// };

// //Seeds random notifications

// const createNotification = async () => {
//   const users = await User.find();
//   if (users.length === 0) {
//     throw new Error("Không có người dùng nào để chọn.");
//   }

//   const randomUser = users[Math.floor(Math.random() * users.length)];

//   const newNotification = new Notification({
//     _id: new mongoose.Types.ObjectId(),
//     user_id: randomUser._id,
//     notification_text: faker.food.description(),
//     created_date: faker.date.between({ from: "2024-09-01", to: Date.now() }),
//   });
//   await newNotification.save();
// };

// export const createRandomNotifications = async (num: number) => {
//   try {
//     for (let i = 0; i <= num; i++) {
//       await createNotification();
//     }
//     console.log(num + " thông báo đã được tạo thành công!");
//   } catch (error) {
//     console.error("Lỗi khi tạo thông báo:", error);
//   }
// };

import { faker } from "@faker-js/faker";
import User from "@/models/UserModel";
import Post from "@/models/PostModel";
import Comment from "@/models/CommentModel";
import mongoose from "mongoose";
import Like from "@/models/LikeModel";
import Follow from "@/models/FollowModel";
import Message from "@/models/MessageModel";
import Notification from "@/models/NotificationModel";

// Hàm lấy ngẫu nhiên một phần tử từ mảng
const getRandomElement = (array: any) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Tạo user ngẫu nhiên
const createUser = async () => {
  const newUser = new User({
    _id: new mongoose.Types.ObjectId(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    sex: faker.person.sex(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    phone_number: faker.phone.number({ style: "human" }),
    birthday: faker.date.birthdate(),
    email: faker.internet.email(),
    profile_picture: faker.image.avatar(),
    biography: faker.person.jobTitle(),
    created_date: faker.date.between({ from: "2024-09-01", to: Date.now() }),
    updated_date: Date.now(),
  });
  await newUser.save();
};

// Tạo post ngẫu nhiên
const createPost = async (user: any) => {
  const newPost = new Post({
    _id: new mongoose.Types.ObjectId(),
    user_id: user._id,
    post_title: faker.person.jobTitle(),
    content: faker.person.jobDescriptor(),
    created_date: faker.date.between({ from: "2024-09-01", to: Date.now() }),
    updated_date: Date.now(),
  });
  await newPost.save();
};

// Tạo comment ngẫu nhiên
const createComment = async (user: any, post: any) => {
  const newComment = new Comment({
    _id: new mongoose.Types.ObjectId(),
    post_id: post._id,
    user_id: user._id,
    comment_text: faker.food.description(),
    created_date: faker.date.between({ from: "2024-09-01", to: Date.now() }),
    updated_date: Date.now(),
  });
  await newComment.save();
};

// Tạo like ngẫu nhiên
const createLike = async (user: any, post: any) => {
  const newLike = new Like({
    _id: new mongoose.Types.ObjectId(),
    post_id: post._id,
    user_id: user._id,
    created_date: faker.date.between({ from: "2024-09-01", to: Date.now() }),
  });
  await newLike.save();
};

// Tạo follow ngẫu nhiên
const createFollow = async (follower: any, followed: any) => {
  const newFollow = new Follow({
    _id: new mongoose.Types.ObjectId(),
    follower_id: follower._id,
    followed_id: followed._id,
    created_date: faker.date.between({ from: "2024-09-01", to: Date.now() }),
  });
  await newFollow.save();
};

// Tạo message ngẫu nhiên
const createMessage = async (sender: any, receiver: any) => {
  const newMessage = new Message({
    _id: new mongoose.Types.ObjectId(),
    sender_id: sender._id,
    receiver_id: receiver._id,
    message_content: faker.food.dish(),
    created_date: faker.date.between({ from: "2024-09-01", to: Date.now() }),
  });
  await newMessage.save();
};

// Tạo notification ngẫu nhiên
const createNotification = async (user: any) => {
  const newNotification = new Notification({
    _id: new mongoose.Types.ObjectId(),
    user_id: user._id,
    notification_text: faker.food.description(),
    created_date: faker.date.between({ from: "2024-09-01", to: Date.now() }),
  });
  await newNotification.save();
};

// Hàm tổng hợp để tạo tất cả dữ liệu ngẫu nhiên
export const createRandomData = async (num: number) => {
  try {
    // Tạo người dùng
    const users = [];
    for (let i = 0; i < num; i++) {
      await createUser();
      const user = await User.findOne().sort({ _id: -1 }).limit(1);
      users.push(user);
    }

    // Tạo bài viết
    const posts = [];
    for (let i = 0; i < num; i++) {
      const randomUser = getRandomElement(users);
      await createPost(randomUser);
      const post = await Post.findOne().sort({ _id: -1 }).limit(1);
      posts.push(post);
    }

    // Tạo bình luận
    for (let i = 0; i < num; i++) {
      const randomUser = getRandomElement(users);
      const randomPost = getRandomElement(posts);
      await createComment(randomUser, randomPost);
    }

    // Tạo lượt thích
    for (let i = 0; i < num; i++) {
      const randomUser = getRandomElement(users);
      const randomPost = getRandomElement(posts);
      await createLike(randomUser, randomPost);
    }


    // Tạo lượt theo dõi
    for (let i = 0; i < num; i++) {
      const randomFollower = getRandomElement(users);
      const randomFollowed = getRandomElement(users);
      if (randomFollower._id !== randomFollowed._id) { // tránh tự theo dõi
        await createFollow(randomFollower, randomFollowed);
      }
    }

    // Tạo tin nhắn
    for (let i = 0; i < num; i++) {
      const randomSender = getRandomElement(users);
      const randomReceiver = getRandomElement(users);
      if (randomSender._id !== randomReceiver._id) { // tránh tự gửi tin nhắn cho chính mình
        await createMessage(randomSender, randomReceiver);
      }
    }

    // Tạo thông báo
    for (let i = 0; i < num; i++) {
      const randomUser = getRandomElement(users);
      await createNotification(randomUser);
    }

    console.log("Dữ liệu ngẫu nhiên đã được tạo thành công!");
  } catch (error) {
    console.error("Lỗi khi tạo dữ liệu ngẫu nhiên:", error);
  }
};
