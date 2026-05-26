import {
    parseOdontogramCondition,
    parseOdontogramSurface,
    getConditionColor,
} from "../../src/lib/odontogram";

describe("parseOdontogramCondition", () => {

    it("should return correct condition if valid", () => {
        expect(parseOdontogramCondition("caries")).toBe("caries");
        expect(parseOdontogramCondition("filled")).toBe("filled");
    });

    it("returns healthy for unknown values", () => {
        expect(parseOdontogramCondition("unknown")).toBe("healthy");
        expect(parseOdontogramCondition("")).toBe("healthy");
    });

    it("is case insensitive", () => {
        expect(parseOdontogramCondition("CARIES")).toBe("caries");
    });

});

describe("parseOdontogramSurface", () => {

    it("should return correct surface if valid", () => {
        expect(parseOdontogramSurface("TOP")).toBe("TOP");
        expect(parseOdontogramSurface("bottom")).toBe("BOTTOM");
    });

    it("returns null for unknown values", () => {
        expect(parseOdontogramSurface("FRONT")).toBeNull();
        expect(parseOdontogramSurface("")).toBeNull();
    });

});

describe("getConditionColor", () => {

    it("should return correct hex for each condition", () => {
        expect(getConditionColor("caries")).toBe("#ef4444");
        expect(getConditionColor("filled")).toBe("#10b981");
        expect(getConditionColor("missing")).toBe("#475569");
        expect(getConditionColor("bridge")).toBe("#8b5cf6");
        expect(getConditionColor("implant")).toBe("#f59e0b");
    });

    it("returns white for healthy and unknown conditions", () => {
        expect(getConditionColor("healthy")).toBe("white");
        expect(getConditionColor("unknown")).toBe("white");
    });

});