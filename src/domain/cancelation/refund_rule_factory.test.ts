import { FullRefund } from "./full_refund";
import { NoRefund } from "./no_refund copy";
import { PartialRefund } from "./partial_refund";
import { RefundRuleFactory } from "./refund_rule_factory";



describe("RefundRuleFactory", () => {
    it("deve retornar FullRefund quando a reserva for cancelada com mais de 7 dias de antecedência", () => {
        const rule = RefundRuleFactory.getRefundRule(8);
        expect(rule).toBeInstanceOf(FullRefund);
        const rule2 = RefundRuleFactory.getRefundRule(20);
        expect(rule2).toBeInstanceOf(FullRefund);
    });
    it("deve retornar NoRefund quando a reserva for cancelada com menos de 1 dia de antecedência", () => {
        const daysUntilCheckIn = 0;
        const rule = RefundRuleFactory.getRefundRule(daysUntilCheckIn);
        expect(rule).toBeInstanceOf(NoRefund);
    });

    it("deve retornar PartialRefund quando a reserva for cancelada entre 1 e 7 dias de antecedência", () => {
        for (let i = 1; i <= 7; i++) {
            const rule = RefundRuleFactory.getRefundRule(i);
            expect(rule).toBeInstanceOf(PartialRefund);
        }
    });
});