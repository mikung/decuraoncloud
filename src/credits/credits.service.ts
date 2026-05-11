import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
@Injectable()
export class CreditsService {
  constructor(private prisma: PrismaService) {}

  async getData(hospcode: string, project_id: any) {
    try {
      const result = await this.prisma.$queryRaw`
  SELECT
    pm.credit_balance,
    ai.slug,
    ai.name,
    ai.credit_cost,
    /* ใช้ CAST เพื่อความปลอดภัยของ Type */
    CAST(CASE 
      WHEN pm.credit_balance >= ai.credit_cost THEN 1 
      ELSE 0 
    END AS SIGNED) AS can_use
  FROM project_members pm
  CROSS JOIN ai_services ai
  WHERE pm.hospcode = ${hospcode}
    AND pm.project_id = ${project_id}
    AND pm.is_active = 1
    AND ai.is_active = 1
`;

      return {
        success: true,
        message: 'status success',
        data: result,
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: 'status failed : ' + e,
      };
    }
  }

  async getReserve(hospcode: string, project_id: any, slug: any) {
    try {
      const result: any = await this.prisma.$queryRaw`
 SELECT pm.credit_balance, ai.credit_cost, ai.id AS ai_service_id
FROM project_members pm
JOIN ai_services ai ON ai.slug = ${slug}
WHERE pm.hospcode = ${hospcode}
AND pm.project_id = ${project_id}
AND pm.is_active = 1
AND ai.is_active = 1

`;
      if (result[0].credit_balance < result[0].credit_cost) {
        throw new HttpException(
          'Payment Required',
          HttpStatus.PAYMENT_REQUIRED,
        );
      }
      return {
        success: true,
        message: 'Reserve success',
        data: result[0],
      };
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: 'Reserve failed : ' + e,
      };
    }
  }

  async debit(body: any) {
    try {
      if (body.success == true) {
        const update: any = await this.prisma.project_members.updateMany({
          where: {
            hospcode: body.hospcode,
            project_id: body.project_id,
            is_active: 1, // แนะนำให้เช็คสถานะด้วย
            credit_balance: {
              gte: body.credit_cost, // เงื่อนไข: credit_balance >= credit_cost
            },
          },
          data: {
            credit_balance: {
              decrement: body.credit_cost, // ลดค่าลงตามจำนวน credit_cost
            },
          },
        });
        const {
          project_id,
          hospcode,
          ai_service_id,
          credit_cost,
          balance_before,
        } = body;
        const insert: any = await this.prisma.credit_transactions.create({
          data: {
            project_id: project_id,
            hospcode: hospcode,
            ai_service_id: ai_service_id,
            type: 'debit',
            amount: credit_cost,
            balance_before: balance_before,
            balance_after: balance_before - credit_cost,
            status: 'completed',
          },
        });
        return {
          success: true,
          message: 'Debit success',
          data: {
            insert: insert,
            update: update,
          },
        };
      } else if (body.success == false) {
        const {
          project_id,
          hospcode,
          ai_service_id,
          credit_cost,
          balance_before,
          error_message,
        } = body;
        const insert: any = await this.prisma.credit_transactions.create({
          data: {
            project_id: project_id,
            hospcode: hospcode,
            ai_service_id: ai_service_id,
            type: 'debit',
            amount: credit_cost,
            balance_before: balance_before,
            balance_after: balance_before, // ยอดคงเดิมเพราะล้มเหลว
            status: 'failed',
            note:  'AI call failed',
          },
        });
        return {
          success: false,
          message: 'Debit failed',
        };
      } else {
        return {
          success: false,
          message: 'Debit failed',
        };
      }
    } catch (e) {
      console.log(e);
      return {
        success: false,
        message: 'Debit failed : ' + e,
      };
    }
    const result = await this.prisma.$queryRaw`
    UPDATE project_members
    SET credit_balance = credit_balance - ${body.credit_cost}
    WHERE id = ${body.id}
    `;
    return result;
  }
}
