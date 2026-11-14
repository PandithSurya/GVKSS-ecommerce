import { User, IUser } from '../../models/User.js';
import { Address } from '../../models/Address.js';
import { ApiError } from '../../utils/apiError.js';

export class UsersService {
  static async getProfile(userId: string): Promise<{ user: Partial<IUser>; addresses: any[] }> {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }

    const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });

    return {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
        status: user.status,
        createdAt: user.createdAt,
      },
      addresses,
    };
  }

  static async updateProfile(userId: string, data: { fullName?: string; phone?: string }): Promise<Partial<IUser>> {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }

    if (data.fullName) user.fullName = data.fullName.trim();
    if (data.phone) user.phone = data.phone.trim();
    await user.save();

    return {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
    };
  }
}
