import { Request, Response, NextFunction } from 'express';
import { VisaStatus } from '../models';
import { AppError } from '../middleware/errorHandler';

export class VisaStatusController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const visaStatuses = await VisaStatus.findAll({
        order: [['category', 'ASC'], ['name', 'ASC']]
      });
      res.json(visaStatuses);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const visaStatus = await VisaStatus.findByPk(id);
      
      if (!visaStatus) {
        throw new AppError('Visa status not found', 404);
      }
      
      res.json(visaStatus);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const visaStatus = await VisaStatus.create(req.body);
      res.status(201).json(visaStatus);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const [updated] = await VisaStatus.update(req.body, {
        where: { id }
      });
      
      if (!updated) {
        throw new AppError('Visa status not found', 404);
      }
      
      const visaStatus = await VisaStatus.findByPk(id);
      res.json(visaStatus);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await VisaStatus.destroy({
        where: { id }
      });
      
      if (!deleted) {
        throw new AppError('Visa status not found', 404);
      }
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}