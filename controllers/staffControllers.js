const Staff = require('../models/staffModel');
const cloudinary = require("../config/cloudinary");

// create new staff
exports.createStaff = async (req, res) => {
  try {
    const {
      staffId,
      firstName,
      lastName,
      phone,
      nin,
      position,
      baseSalary
    } = req.body;

    if (!staffId || !firstName || !lastName || !phone || !nin || !position) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    const existingStaff = await Staff.findOne({ staffId });
    if (existingStaff) {
      return res.status(400).json({ msg: "Staff already exists" });
    }

    let photoData = {};

    // 🔥 Upload image if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "staff"
      });

      photoData = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    const staff = await Staff.create({
      staffId,
      firstName,
      lastName,
      phone,
      nin,
      position,
      baseSalary,
      photo: photoData,
      createdBy: req.user.id
    });

    res.status(201).json({
      msg: "Staff created successfully",
      staff
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to create staff" });
  }
};


exports.addBonus = async (req, res) => {
  const { amount, reason } = req.body;

  const staff = await Staff.findById(req.params.id);
  if (!staff) return res.status(404).json({ msg: "Staff not found" });

  staff.bonuses.push({
    amount,
    reason,
    appliedBy: req.user.id
  });

  await staff.save();

  res.json({
    msg: "Bonus added",
    netSalary: staff.netSalary
  });
};

exports.addDeduction = async (req, res) => {
  const { amount, reason } = req.body;

  const staff = await Staff.findById(req.params.id);
  if (!staff) return res.status(404).json({ msg: "Staff not found" });

  staff.deductions.push({
    amount,
    reason,
    appliedBy: req.user.id
  });

  await staff.save();

  res.json({
    msg: "Deduction applied",
    netSalary: staff.netSalary
  });
};

// get single staff by id
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ msg: "Staff not found" });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ msg: "Failed to get staff" });
  }
};

// get all staff
exports.getAllStaff = async (req, res) => {
  try {
    const staffList = await Staff.find();
    res.json(staffList);
  } catch (error) {
    res.status(500).json({ msg: "Failed to get staff list" });
  }
};

// update staff
exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ msg: "Staff not found" });
    }

    const {
      firstName,
      lastName,
      phone,
      nin,
      position,
      baseSalary,
      employmentStatus
    } = req.body;

    staff.firstName = firstName || staff.firstName;
    staff.lastName = lastName || staff.lastName;
    staff.phone = phone || staff.phone;
    staff.nin = nin || staff.nin;
    staff.position = position || staff.position;
    staff.baseSalary = baseSalary || staff.baseSalary;
    staff.employmentStatus = employmentStatus || staff.employmentStatus;

    // 🔥 If new image uploaded
    if (req.file) {
      // delete old image
      if (staff.photo?.publicId) {
        await cloudinary.uploader.destroy(staff.photo.publicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "staff"
      });

      staff.photo = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    staff.updatedBy = req.user.id;
    staff.lastUpdatedAt = Date.now();

    await staff.save();

    res.json({ msg: "Staff updated successfully", staff });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to update staff" });
  }
};

// delete staff
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ msg: "Staff not found" });
    }
    await staff.remove();
    res.json({ msg: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Failed to delete staff" });
  }
};

// deactivate staff
exports.deactivateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ msg: "Staff not found" });
    }
    staff.employmentStatus = "inactive";
    staff.isActive = false;

    //check who is deactivating
    staff.deactivatedBy = req.user.id;
    staff.deactivatedAt = Date.now();

    await staff.save();
    res.json({ msg: "Staff deactivated successfully", staff });
  } catch (error) {
    res.status(500).json({ msg: "Failed to deactivate staff" });
  }
};

// activate staff
exports.activateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ msg: "Staff not found" });
    }
    staff.employmentStatus = "active";
    staff.isActive = true;
    await staff.save();
    res.json({ msg: "Staff activated successfully", staff });
  } catch (error) {
    res.status(500).json({ msg: "Failed to activate staff" });
  }
};
