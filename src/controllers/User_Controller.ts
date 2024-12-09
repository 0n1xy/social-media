import User from "@/models/UserModel";
import Notification from "@/models/NotificationModel";
import { Request, Response } from "express";
import UserService from "@/services/User_Service";
import PaginationService from "@/services/Pagination_Service";
import {
  USER_LIMIT_PAGINATION,
  USER_PAGE_PAGINATION,
} from "@/constant/User_Constant";
import Follow from "@/models/FollowModel";
import mongoose from "mongoose";
import Post from "@/models/PostModel";
import { ObjectId } from "mongodb";

const userService = new UserService();
const paginationService = new PaginationService();

export const createUser = async (req: Request, res: Response) => {
  try {
    const response = await userService.signUpMethod(req.body);

    if (response) {
      return res.status(201).json({
        status: 201,
        message: "User created successfully",
        data: response,
      });
    }
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const loginData = req.body;
  } catch (error) {
    res.status(500).json({ message: "Error login user", error });
  }
};

export const getallUserData = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || USER_PAGE_PAGINATION;
    const limit = parseInt(req.query.limit as string) || USER_LIMIT_PAGINATION;
    const user = await User.find();
    // Call the pagination service with User model
    const paginationResult = await paginationService.paginateArray(
      user,
      page,
      limit
    );

    return res.status(200).json({
      data: paginationResult.data,
      totalDocuments: paginationResult.totalDocuments,
      totalPages: paginationResult.totalPages,
      currentPage: paginationResult.currentPage,
      limit: paginationResult.limit,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userData = await User.findOne({ _id: req.params.id });
    if (userData) {
      return res.status(200).json({
        status: 200,
        data: userData,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Fail to find user", error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (updatedUser) {
      res
        .status(200)
        .json({ message: "User updated successfully", data: updatedUser });
    } else {
      res.status(500).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(500).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error });
  }
};

export const followUser = async (req: Request, res: Response) => {
  try {
    const { senderUser: senderUserId, receiveUser: receiveUserId } = req.body;

    // Validate input
    if (!senderUserId || !receiveUserId) {
      res
        .status(400)
        .json({ message: "Sender and receiver user IDs are required" });
      return;
    }

    // Fetch users
    const receiveUser = await User.findById(receiveUserId);
    const senderUser = await User.findById(senderUserId);

    if (!receiveUser || !senderUser) {
      res.status(404).json({ message: "One or both users not found" });
      return;
    }

    const notification = new Notification({
      _id: new mongoose.Types.ObjectId(),
      user_id: receiveUserId,
      notification_text: `${senderUser.username} has followed you`,
    });

    const existingFollow = await Follow.findOne({
      sender_id: senderUserId,
      receiver_id: receiveUserId,
    });

    if (existingFollow) {
      return res
        .status(200)
        .json({ message: "You are already following this user" });
    }

    const follow = new Follow({
      _id: new mongoose.Types.ObjectId(),
      sender_id: senderUser._id, // Corrected to senderUser._id
      receiver_id: receiveUser._id, // Added followee_id
    });

    const saveFollow = await follow.save();

    if (saveFollow) {
      await User.findByIdAndUpdate(
        senderUserId,
        { $push: { follows: receiveUser._id } },
        { new: true }
      );
    }

    const service = "User_Service";

    const response = await userService.followMethod(
      service,
      receiveUser.id,
      senderUser.id
    );

    if (response) {
      await notification.save();
    }
    res.status(200).json({ message: "Follow request sent successfully" });
  } catch (error) {
    console.error("Error in followUser:", error);
    res.status(500).json({ message: "Failed to send follow request", error });
  }
};

export const getFollowRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    // Validate that userId is provided
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Validate that userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID." });
    }

    const sentRequests = await Follow.aggregate([
      {
        $match: {
          sender_id: new mongoose.Types.ObjectId(userId),
          status: "pending",
        },
      },
      {
        $lookup: {
          from: "users", // Collection name for User
          localField: "receiver_id",
          foreignField: "_id",
          as: "receiver",
        },
      },
      {
        $unwind: "$receiver", // Flatten the receiver array
      },
      {
        $project: {
          _id: 1, // Follow request ID
          receiver_id: "$receiver._id",
          receiver_username: "$receiver.username",
          receiver_email: "$receiver.email",
          status: 1,
          created_date: 1,
        },
      },
    ]);

    // Return the list of sent follow requests
    return res.status(200).json(sentRequests);

    return sentRequests;
  } catch (error) {
    res.status(500).json({ message: "Failed to send follow request", error });
  }
};

export const newFeed = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const userId = req.body.userId;

    const followData = await Follow.aggregate([
      {
        $match: {
          sender_id: new mongoose.Types.ObjectId(userId),
          status: "accepted",
        },
      },
      {
        $lookup: {
          from: "users", // Collection name for User
          localField: "receiver_id",
          foreignField: "_id",
          as: "receiver",
        },
      },
      {
        $unwind: "$receiver", // Flatten the receiver array
      },
      {
        $project: {
          _id: 1, // Follow request ID
          receiver_id: "$receiver._id",
          receiver_username: "$receiver.username",
          receiver_email: "$receiver.email",
          status: 1,
          created_date: 1,
        },
      },
    ]);

    const receiverIds = followData.map((item) => item.receiver_id);

    const postData = await Post.find({ user_id: { $in: receiverIds } }).sort({
      created_date: -1,
    });

    const insertAdsIntoFeed = (posts: any[], adsArray: any[]) => {
      const combinedFeed = [...posts];
      let adIndex = 0;

      // Insert one ad after every 6 posts
      for (let i = 6; i < combinedFeed.length; i += 7) {
        if (adIndex < adsArray.length) {
          combinedFeed.splice(i, 0, {
            ...adsArray[adIndex],
            isAdvertisement: true, // Flag to identify ads in the feed
          });
          adIndex = (adIndex + 1) % adsArray.length; // Cycle through ads
        }
      }

      return combinedFeed;
    };

    // Combine posts with ads
    const combinedFeed = insertAdsIntoFeed(postData, ads);

    const paginationResult = await paginationService.paginateArray(
      combinedFeed,
      page,
      limit
    );

    return res.status(200).json(paginationResult);
  } catch (error) {
    res.status(500).json({ message: "Failed to send follow request", error });
  }
};

const ads = [
  {
    _id: new ObjectId(),
    user_id: new ObjectId("65f1a1234567890123456789"), // Assuming this is Nike's user ID
    post_title: "Just Do It - New Nike Air Max 2024",
    content:
      "Experience unprecedented comfort with our latest Nike Air Max collection. Featuring revolutionary cushioning technology and sleek design. Limited time offer: Get 15% off on your first purchase! #NikeAir #SportsFashion",
    media: ["nike-air-max-2024-hero.jpg", "nike-air-max-lifestyle.jpg"],
    created_date: new Date("2024-03-15T09:00:00Z"),
    updated_date: new Date("2024-03-15T09:00:00Z"),
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId("65f1a2234567890123456789"), // Spotify's user ID
    post_title: "Unlock Premium Music Experience",
    content:
      "Get 3 months of Spotify Premium for free! Stream ad-free music, download your favorite tracks, and enjoy exclusive content. Limited time offer for new subscribers. Click now to transform your music experience! 🎵 #SpotifyPremium #MusicStreaming",
    media: ["spotify-premium-banner.jpg"],
    created_date: new Date("2024-03-14T15:30:00Z"),
    updated_date: new Date("2024-03-14T15:30:00Z"),
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId("65f1a3234567890123456789"), // Apple's user ID
    post_title: "Introducing the New MacBook Air",
    content:
      "Thinner. Lighter. More powerful than ever. The new MacBook Air with M3 chip delivers extraordinary performance with up to 18 hours of battery life. Pre-order now and get free AirPods! 💻 #Apple #MacBookAir #TechInnovation",
    media: [
      "macbook-air-m3-front.jpg",
      "macbook-air-m3-side.jpg",
      "free-airpods-promo.jpg",
    ],
    created_date: new Date("2024-03-13T12:00:00Z"),
    updated_date: new Date("2024-03-13T12:00:00Z"),
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId("65f1a4234567890123456789"), // Uber Eats' user ID
    post_title: "50% Off Your Next 3 Orders!",
    content:
      "Hungry? Order now and save big! Use code FEAST50 for 50% off your next three orders on Uber Eats. Minimum order $20. Valid for 48 hours only. Discover local favorites and get them delivered to your doorstep! 🍔🍕 #UberEats #FoodDelivery",
    media: ["uber-eats-promo-banner.jpg"],
    created_date: new Date("2024-03-12T18:45:00Z"),
    updated_date: new Date("2024-03-12T18:45:00Z"),
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId("65f1a5234567890123456789"), // Samsung's user ID
    post_title: "Galaxy S24 Ultra - Pre-order Now",
    content:
      "Experience the future of mobile photography with the new Galaxy S24 Ultra. Featuring AI-powered camera capabilities and the strongest Gorilla Glass ever. Pre-order now and get a free Galaxy Watch! 📱 #Samsung #GalaxyS24Ultra #Innovation",
    media: ["galaxy-s24-ultra-main.jpg", "galaxy-s24-camera-demo.jpg"],
    created_date: new Date("2024-03-11T10:15:00Z"),
    updated_date: new Date("2024-03-11T10:15:00Z"),
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId("65f1a6234567890123456789"), // Airbnb's user ID
    post_title: "Summer Getaway: Early Bird Discount",
    content:
      "Plan your summer adventure early and save 20% on stays over 5 nights! Explore unique homes worldwide. Book by April 30 for stays between June and August. Your perfect vacation awaits! 🏖️ #Airbnb #Travel #SummerVacation",
    media: ["summer-destinations-collage.jpg", "beachfront-villa.jpg"],
    created_date: new Date("2024-03-10T14:20:00Z"),
    updated_date: new Date("2024-03-10T14:20:00Z"),
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId("65f1a7234567890123456789"), // Tesla's user ID
    post_title: "Model Y: Now with Enhanced Autopilot",
    content:
      "Experience the future of driving with Tesla Model Y. Now featuring Enhanced Autopilot at no extra cost. Schedule a test drive today and feel the difference. Limited time offer on immediate deliveries. ⚡ #Tesla #ModelY #ElectricVehicles",
    media: ["tesla-model-y-white.jpg", "autopilot-demo.jpg"],
    created_date: new Date("2024-03-09T16:30:00Z"),
    updated_date: new Date("2024-03-09T16:30:00Z"),
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId("65f1a8234567890123456789"), // Adobe's user ID
    post_title: "Creative Cloud - Student Special",
    content:
      "Students, unleash your creativity! Get Adobe Creative Cloud for 65% off. Access Photoshop, Illustrator, Premier Pro, and more. First month free! Valid student ID required. Start creating today! 🎨 #Adobe #CreativeCloud #StudentOffer",
    media: ["creative-cloud-apps.jpg", "student-artwork-showcase.jpg"],
    created_date: new Date("2024-03-08T11:45:00Z"),
    updated_date: new Date("2024-03-08T11:45:00Z"),
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId("65f1a9234567890123456789"), // HelloFresh's user ID
    post_title: "16 Free Meals + Free Shipping",
    content:
      "Make dinner time exciting again! Get 16 free meals + free shipping with code FRESH16. Choose from 50+ weekly recipes. Skip or cancel anytime. Fresh ingredients delivered to your door! 🥗 #HelloFresh #MealKit #HealthyEating",
    media: ["hellofresh-meal-variety.jpg", "cooking-made-easy.jpg"],
    created_date: new Date("2024-03-07T13:00:00Z"),
    updated_date: new Date("2024-03-07T13:00:00Z"),
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId("65f1aa234567890123456789"), // Planet Fitness's user ID
    post_title: "Join Now - $1 Down, $10 Monthly",
    content:
      "Start your fitness journey today! Join Planet Fitness for just $1 down and $10 monthly. Access to all equipment, free fitness training, and worldwide club access. No commitment - cancel anytime! 💪 #PlanetFitness #Fitness #GymMembership",
    media: ["planet-fitness-gym.jpg", "fitness-training-session.jpg"],
    created_date: new Date("2024-03-06T08:30:00Z"),
    updated_date: new Date("2024-03-06T08:30:00Z"),
  },
];
