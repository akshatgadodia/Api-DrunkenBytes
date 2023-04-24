const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const Ticket = require("../models/Ticket");

const saveTicket = asyncHandler(async (req, res, next) => {
  await new Ticket({
    createdBy: req.userId ?? undefined,
    subject: req.body.subject,
    type: req.body.type,
    conversation: [
      {
        sender: req.userId ?? null,
        message: req.body.message,
        sentBy: "user",
      },
    ],
    lastUpdated: new Date(),
    name: req.body.name,
    email: req.body.email,
  }).save();
  res.status(200).json({
    success: true,
    data: {
      message: "Ticket Successfully Created",
    },
  });
});

const replyToTicket = asyncHandler(async (req, res, next) => {
  const ticketId = req.params.id;
  let ticket;
  let status;
  if (req.roles.includes(6541)) status = "Response Pending from Operator";
  else status = req.body.status;
  ticket = await Ticket.findOneAndUpdate(
    { _id: ticketId },
    {
      $push: {
        conversation: {
          sender: req.userId,
          message: req.body.message,
          sentBy: req.roles.includes(6541) ? "user" : "supportUser",
        },
      },
      lastUpdated: new Date(),
      status,
    },
    { new: true }
  );
  if (!ticket) return next(new ErrorResponse("Ticket not found", 404));
  res.status(201).json({
    success: true,
    data: {
      message: "Ticket Successfully Updated",
    },
  });
});

const closeTicket = asyncHandler(async (req, res, next) => {
  const ticketId = req.params.id;
  let ticket;
  ticket = await Ticket.findOneAndUpdate(
    { _id: ticketId },
    {
      $push: {
        conversation: {
          sender: req.userId,
          message: req.roles.includes(6541)
            ? "Ticket has been closed by You"
            : req.body.message,
          sentBy: req.roles.includes(6541) ? "user" : "supportUser",
        },
      },
      lastUpdated: new Date(),
      status: req.roles.includes(6541)
        ? "Ticket has been closed by You"
        : req.body.status,
      isSolved: true,
    },
    { new: true }
  );
  if (!ticket) return next(new ErrorResponse("Ticket not found", 404));
  res.status(201).json({
    success: true,
    data: {
      message: "Ticket Closed Successfully",
    },
  });
});

const getTicketById = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findOne({ _id: req.params.id }).populate([
    {
      path: "conversation.sender",
      select: "name _id", // Specify the fields to select from the populated document
    },
    {
      path: "createdBy",
      select: "name _id", // Specify the fields to select from the populated document
    },
  ]);
  res.status(201).json({
    success: true,
    data: {
      ticket,
    },
  });
});

const getTickets = asyncHandler(async (req, res, next) => {
  const createdBy = req.userId;
  const { filters, page, size, sort } = req.query;
  let searchParameters = [{ createdBy }];
  if (filters && filters !== "{}") {
    filters.split(",").map((element) => {
      const queryParam = JSON.parse(element);
      const key = Object.keys(queryParam)[0];
      const value = Object.values(queryParam)[0];
      if (key === "createdBy") searchParameters.push({ [key]: value });
      else if (key === "dateCreated")
        searchParameters.push({
          [key]: {
            $gte: `${value}T00:00:00.000Z`,
            $lt: `${value}T23:59:59.999Z`,
          },
        });
      else if (key === "lastUpdated")
        searchParameters.push({
          [key]: {
            $gte: `${value}T00:00:00.000Z`,
            $lt: `${value}T23:59:59.999Z`,
          },
        });
      else searchParameters.push({ [key]: { $regex: ".*" + value + ".*" } });
    });
  }
  const [totalTickets, tickets] = await Promise.all([
    Ticket.countDocuments({
      $and: searchParameters,
    }),
    Ticket.find({ $and: searchParameters })
      .skip((page - 1) * size)
      .limit(size)
      .sort(JSON.parse(sort))
      .select({ conversation: 0, createdBy: 0 }),
  ]);
  res.status(200).json({
    success: true,
    data: {
      tickets,
      totalTickets,
    },
  });
});

const getAllTickets = asyncHandler(async (req, res, next) => {
  const { filters, page, size, sort } = req.query;
  let searchParameters = [];
  if (filters && filters !== "{}") {
    filters.split(",").map((element) => {
      const queryParam = JSON.parse(element);
      const key = Object.keys(queryParam)[0];
      const value = Object.values(queryParam)[0];
      if (key === "createdBy") searchParameters.push({ [key]: value });
      else if (key === "dateCreated")
        searchParameters.push({
          [key]: {
            $gte: `${value}T00:00:00.000Z`,
            $lt: `${value}T23:59:59.999Z`,
          },
        });
      else if (key === "lastUpdated")
        searchParameters.push({
          [key]: {
            $gte: `${value}T00:00:00.000Z`,
            $lt: `${value}T23:59:59.999Z`,
          },
        });
      else searchParameters.push({ [key]: { $regex: ".*" + value + ".*" } });
    });
  }
  if (req.roles.includes(1541)) searchParameters = searchParameters;
  else if (req.roles.includes(7489)) searchParameters.push({ type: "Support" });
  else if (req.roles.includes(3894)) searchParameters.push({ type: "Editor" });
  else if (req.roles.includes(8458)) searchParameters.push({ type: "Sales" });
  const [totalTickets, tickets] = await Promise.all([
    Ticket.countDocuments({
      $and: searchParameters,
    }),
    Ticket.find({ $and: searchParameters })
      .skip((page - 1) * size)
      .limit(size)
      .populate({ path: "createdBy", select: ["name", "_id"] })
      .sort(JSON.parse(sort)),
  ]);
  res.status(200).json({
    success: true,
    data: {
      tickets,
      totalTickets,
    },
  });
});

module.exports = {
  saveTicket,
  getTickets,
  getTicketById,
  getAllTickets,
  replyToTicket,
  closeTicket,
};
