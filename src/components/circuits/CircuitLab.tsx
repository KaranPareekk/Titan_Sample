import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Cpu,
  Plus,
  Trash2,
  RotateCcw,
  Zap,
  Activity,
  Table,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { GateType, LogicGate, LogicWire } from '../../types';

// Preset configurations
const PRESET_HALF_ADDER: { gates: LogicGate[]; wires: LogicWire[] } = {
  gates: [
    { id: 'in_a', type: 'INPUT', x: 60, y: 80, width: 80, height: 50, inputs: [], output: true, label: 'IN A' },
    { id: 'in_b', type: 'INPUT', x: 60, y: 190, width: 80, height: 50, inputs: [], output: false, label: 'IN B' },
    { id: 'xor_1', type: 'XOR', x: 240, y: 70, width: 90, height: 65, inputs: [true, false], output: true, label: 'XOR' },
    { id: 'and_1', type: 'AND', x: 240, y: 180, width: 90, height: 65, inputs: [true, false], output: false, label: 'AND' },
    { id: 'out_sum', type: 'OUTPUT', x: 420, y: 80, width: 90, height: 50, inputs: [true], output: true, label: 'SUM (S)' },
    { id: 'out_carry', type: 'OUTPUT', x: 420, y: 190, width: 90, height: 50, inputs: [false], output: false, label: 'CARRY (C)' },
  ],
  wires: [
    { id: 'w1', fromGateId: 'in_a', fromPinIndex: 0, toGateId: 'xor_1', toPinIndex: 0 },
    { id: 'w2', fromGateId: 'in_b', fromPinIndex: 0, toGateId: 'xor_1', toPinIndex: 1 },
    { id: 'w3', fromGateId: 'in_a', fromPinIndex: 0, toGateId: 'and_1', toPinIndex: 0 },
    { id: 'w4', fromGateId: 'in_b', fromPinIndex: 0, toGateId: 'and_1', toPinIndex: 1 },
    { id: 'w5', fromGateId: 'xor_1', fromPinIndex: 0, toGateId: 'out_sum', toPinIndex: 0 },
    { id: 'w6', fromGateId: 'and_1', fromPinIndex: 0, toGateId: 'out_carry', toPinIndex: 0 },
  ],
};

const PRESET_FULL_ADDER: { gates: LogicGate[]; wires: LogicWire[] } = {
  gates: [
    { id: 'fa_a', type: 'INPUT', x: 50, y: 50, width: 80, height: 50, inputs: [], output: true, label: 'IN A' },
    { id: 'fa_b', type: 'INPUT', x: 50, y: 140, width: 80, height: 50, inputs: [], output: true, label: 'IN B' },
    { id: 'fa_cin', type: 'INPUT', x: 50, y: 250, width: 80, height: 50, inputs: [], output: false, label: 'C_IN' },
    { id: 'fa_xor1', type: 'XOR', x: 220, y: 50, width: 90, height: 65, inputs: [true, true], output: false, label: 'XOR 1' },
    { id: 'fa_xor2', type: 'XOR', x: 390, y: 80, width: 90, height: 65, inputs: [false, false], output: false, label: 'XOR 2' },
    { id: 'fa_and1', type: 'AND', x: 220, y: 150, width: 90, height: 65, inputs: [true, true], output: true, label: 'AND 1' },
    { id: 'fa_and2', type: 'AND', x: 390, y: 220, width: 90, height: 65, inputs: [false, false], output: false, label: 'AND 2' },
    { id: 'fa_or', type: 'OR', x: 550, y: 180, width: 90, height: 65, inputs: [true, false], output: true, label: 'OR' },
    { id: 'fa_sum', type: 'OUTPUT', x: 560, y: 80, width: 90, height: 50, inputs: [false], output: false, label: 'SUM (S)' },
    { id: 'fa_cout', type: 'OUTPUT', x: 700, y: 180, width: 90, height: 50, inputs: [true], output: true, label: 'C_OUT' },
  ],
  wires: [
    { id: 'fa_w1', fromGateId: 'fa_a', fromPinIndex: 0, toGateId: 'fa_xor1', toPinIndex: 0 },
    { id: 'fa_w2', fromGateId: 'fa_b', fromPinIndex: 0, toGateId: 'fa_xor1', toPinIndex: 1 },
    { id: 'fa_w3', fromGateId: 'fa_a', fromPinIndex: 0, toGateId: 'fa_and1', toPinIndex: 0 },
    { id: 'fa_w4', fromGateId: 'fa_b', fromPinIndex: 0, toGateId: 'fa_and1', toPinIndex: 1 },
    { id: 'fa_w5', fromGateId: 'fa_xor1', fromPinIndex: 0, toGateId: 'fa_xor2', toPinIndex: 0 },
    { id: 'fa_w6', fromGateId: 'fa_cin', fromPinIndex: 0, toGateId: 'fa_xor2', toPinIndex: 1 },
    { id: 'fa_w7', fromGateId: 'fa_xor1', fromPinIndex: 0, toGateId: 'fa_and2', toPinIndex: 0 },
    { id: 'fa_w8', fromGateId: 'fa_cin', fromPinIndex: 0, toGateId: 'fa_and2', toPinIndex: 1 },
    { id: 'fa_w9', fromGateId: 'fa_xor2', fromPinIndex: 0, toGateId: 'fa_sum', toPinIndex: 0 },
    { id: 'fa_w10', fromGateId: 'fa_and1', fromPinIndex: 0, toGateId: 'fa_or', toPinIndex: 0 },
    { id: 'fa_w11', fromGateId: 'fa_and2', fromPinIndex: 0, toGateId: 'fa_or', toPinIndex: 1 },
    { id: 'fa_w12', fromGateId: 'fa_or', fromPinIndex: 0, toGateId: 'fa_cout', toPinIndex: 0 },
  ],
};

const PRESET_MUX_2TO1: { gates: LogicGate[]; wires: LogicWire[] } = {
  gates: [
    { id: 'mux_d0', type: 'INPUT', x: 60, y: 50, width: 80, height: 50, inputs: [], output: true, label: 'DATA 0' },
    { id: 'mux_sel', type: 'INPUT', x: 60, y: 140, width: 80, height: 50, inputs: [], output: false, label: 'SELECT' },
    { id: 'mux_d1', type: 'INPUT', x: 60, y: 230, width: 80, height: 50, inputs: [], output: false, label: 'DATA 1' },
    { id: 'mux_not', type: 'NOT', x: 210, y: 100, width: 85, height: 55, inputs: [false], output: true, label: 'NOT SEL' },
    { id: 'mux_and0', type: 'AND', x: 360, y: 55, width: 90, height: 65, inputs: [true, true], output: true, label: 'AND 0' },
    { id: 'mux_and1', type: 'AND', x: 360, y: 200, width: 90, height: 65, inputs: [false, false], output: false, label: 'AND 1' },
    { id: 'mux_or', type: 'OR', x: 520, y: 125, width: 90, height: 65, inputs: [true, false], output: true, label: 'OR' },
    { id: 'mux_out', type: 'OUTPUT', x: 680, y: 130, width: 90, height: 50, inputs: [true], output: true, label: 'MUX OUT' },
  ],
  wires: [
    { id: 'mw1', fromGateId: 'mux_sel', fromPinIndex: 0, toGateId: 'mux_not', toPinIndex: 0 },
    { id: 'mw2', fromGateId: 'mux_d0', fromPinIndex: 0, toGateId: 'mux_and0', toPinIndex: 0 },
    { id: 'mw3', fromGateId: 'mux_not', fromPinIndex: 0, toGateId: 'mux_and0', toPinIndex: 1 },
    { id: 'mw4', fromGateId: 'mux_sel', fromPinIndex: 0, toGateId: 'mux_and1', toPinIndex: 0 },
    { id: 'mw5', fromGateId: 'mux_d1', fromPinIndex: 0, toGateId: 'mux_and1', toPinIndex: 1 },
    { id: 'mw6', fromGateId: 'mux_and0', fromPinIndex: 0, toGateId: 'mux_or', toPinIndex: 0 },
    { id: 'mw7', fromGateId: 'mux_and1', fromPinIndex: 0, toGateId: 'mux_or', toPinIndex: 1 },
    { id: 'mw8', fromGateId: 'mux_or', fromPinIndex: 0, toGateId: 'mux_out', toPinIndex: 0 },
  ],
};

const PRESET_SR_LATCH: { gates: LogicGate[]; wires: LogicWire[] } = {
  gates: [
    { id: 'sr_r', type: 'INPUT', x: 60, y: 60, width: 80, height: 50, inputs: [], output: false, label: 'RESET (R)' },
    { id: 'sr_s', type: 'INPUT', x: 60, y: 220, width: 80, height: 50, inputs: [], output: true, label: 'SET (S)' },
    { id: 'sr_nor1', type: 'NOR', x: 260, y: 60, width: 90, height: 65, inputs: [false, false], output: true, label: 'NOR Top' },
    { id: 'sr_nor2', type: 'NOR', x: 260, y: 220, width: 90, height: 65, inputs: [true, true], output: false, label: 'NOR Bot' },
    { id: 'sr_q', type: 'OUTPUT', x: 460, y: 65, width: 90, height: 50, inputs: [true], output: true, label: 'STATE Q' },
    { id: 'sr_qbar', type: 'OUTPUT', x: 460, y: 225, width: 90, height: 50, inputs: [false], output: false, label: "STATE Q'" },
  ],
  wires: [
    { id: 'srw1', fromGateId: 'sr_r', fromPinIndex: 0, toGateId: 'sr_nor1', toPinIndex: 0 },
    { id: 'srw2', fromGateId: 'sr_nor2', fromPinIndex: 0, toGateId: 'sr_nor1', toPinIndex: 1 },
    { id: 'srw3', fromGateId: 'sr_nor1', fromPinIndex: 0, toGateId: 'sr_nor2', toPinIndex: 0 },
    { id: 'srw4', fromGateId: 'sr_s', fromPinIndex: 0, toGateId: 'sr_nor2', toPinIndex: 1 },
    { id: 'srw5', fromGateId: 'sr_nor1', fromPinIndex: 0, toGateId: 'sr_q', toPinIndex: 0 },
    { id: 'srw6', fromGateId: 'sr_nor2', fromPinIndex: 0, toGateId: 'sr_qbar', toPinIndex: 0 },
  ],
};

const PRESET_COMPARATOR_2BIT: { gates: LogicGate[]; wires: LogicWire[] } = {
  gates: [
    { id: 'cmp_a0', type: 'INPUT', x: 60, y: 40, width: 80, height: 50, inputs: [], output: true, label: 'A[0]' },
    { id: 'cmp_b0', type: 'INPUT', x: 60, y: 110, width: 80, height: 50, inputs: [], output: true, label: 'B[0]' },
    { id: 'cmp_a1', type: 'INPUT', x: 60, y: 200, width: 80, height: 50, inputs: [], output: false, label: 'A[1]' },
    { id: 'cmp_b1', type: 'INPUT', x: 60, y: 270, width: 80, height: 50, inputs: [], output: false, label: 'B[1]' },
    { id: 'cmp_xnor0', type: 'XNOR', x: 240, y: 70, width: 90, height: 65, inputs: [true, true], output: true, label: 'Bit 0 Equiv' },
    { id: 'cmp_xnor1', type: 'XNOR', x: 240, y: 230, width: 90, height: 65, inputs: [false, false], output: true, label: 'Bit 1 Equiv' },
    { id: 'cmp_and', type: 'AND', x: 420, y: 150, width: 90, height: 65, inputs: [true, true], output: true, label: 'Both Equal' },
    { id: 'cmp_out', type: 'OUTPUT', x: 580, y: 155, width: 90, height: 50, inputs: [true], output: true, label: 'A == B' },
  ],
  wires: [
    { id: 'cmpw1', fromGateId: 'cmp_a0', fromPinIndex: 0, toGateId: 'cmp_xnor0', toPinIndex: 0 },
    { id: 'cmpw2', fromGateId: 'cmp_b0', fromPinIndex: 0, toGateId: 'cmp_xnor0', toPinIndex: 1 },
    { id: 'cmpw3', fromGateId: 'cmp_a1', fromPinIndex: 0, toGateId: 'cmp_xnor1', toPinIndex: 0 },
    { id: 'cmpw4', fromGateId: 'cmp_b1', fromPinIndex: 0, toGateId: 'cmp_xnor1', toPinIndex: 1 },
    { id: 'cmpw5', fromGateId: 'cmp_xnor0', fromPinIndex: 0, toGateId: 'cmp_and', toPinIndex: 0 },
    { id: 'cmpw6', fromGateId: 'cmp_xnor1', fromPinIndex: 0, toGateId: 'cmp_and', toPinIndex: 1 },
    { id: 'cmpw7', fromGateId: 'cmp_and', fromPinIndex: 0, toGateId: 'cmp_out', toPinIndex: 0 },
  ],
};

// --- Advanced Complex Digital Computational Systems ---

const PRESET_ALU_PROCESSOR: { gates: LogicGate[]; wires: LogicWire[] } = {
  gates: [
    // Operands and Control Inputs
    { id: 'alu_a', type: 'INPUT', x: 50, y: 50, width: 85, height: 50, inputs: [], output: true, label: 'BUS A' },
    { id: 'alu_b', type: 'INPUT', x: 50, y: 140, width: 85, height: 50, inputs: [], output: true, label: 'BUS B' },
    { id: 'alu_cin', type: 'INPUT', x: 50, y: 230, width: 85, height: 50, inputs: [], output: false, label: 'CARRY IN' },
    { id: 'alu_op', type: 'INPUT', x: 50, y: 320, width: 85, height: 50, inputs: [], output: false, label: 'OP: 0=ADD 1=LOGIC' },

    // Arithmetic Core (Full Adder Stage)
    { id: 'alu_xor1', type: 'XOR', x: 230, y: 50, width: 90, height: 65, inputs: [true, true], output: false, label: 'A ⊕ B' },
    { id: 'alu_xor2', type: 'XOR', x: 380, y: 65, width: 90, height: 65, inputs: [false, false], output: false, label: 'SUM CORE' },
    { id: 'alu_and1', type: 'AND', x: 230, y: 140, width: 90, height: 65, inputs: [true, true], output: true, label: 'A · B' },
    { id: 'alu_and2', type: 'AND', x: 380, y: 170, width: 90, height: 65, inputs: [false, false], output: false, label: 'CIN · PROP' },
    { id: 'alu_or_c', type: 'OR', x: 520, y: 155, width: 90, height: 65, inputs: [true, false], output: true, label: 'CARRY GEN' },

    // Logic Function Core
    { id: 'alu_logic_xor', type: 'XOR', x: 230, y: 260, width: 90, height: 65, inputs: [true, true], output: false, label: 'LOGIC XOR' },

    // Operation Multiplexer Selection
    { id: 'alu_not_op', type: 'NOT', x: 230, y: 350, width: 80, height: 50, inputs: [false], output: true, label: 'NOT OP' },
    { id: 'alu_mux_and0', type: 'AND', x: 550, y: 65, width: 90, height: 65, inputs: [false, true], output: false, label: 'ARITH PASS' },
    { id: 'alu_mux_and1', type: 'AND', x: 550, y: 280, width: 90, height: 65, inputs: [false, false], output: false, label: 'LOGIC PASS' },
    { id: 'alu_mux_or', type: 'OR', x: 700, y: 175, width: 90, height: 65, inputs: [false, false], output: false, label: 'ALU MUX' },

    // Zero Flag Detection Logic
    { id: 'alu_zero_nor', type: 'NOR', x: 840, y: 80, width: 90, height: 65, inputs: [false, false], output: true, label: 'ZERO DETECT' },

    // Outputs
    { id: 'alu_out_res', type: 'OUTPUT', x: 860, y: 180, width: 95, height: 50, inputs: [false], output: false, label: 'ALU RESULT' },
    { id: 'alu_out_cout', type: 'OUTPUT', x: 700, y: 50, width: 95, height: 50, inputs: [true], output: true, label: 'CARRY OUT' },
    { id: 'alu_out_zero', type: 'OUTPUT', x: 990, y: 85, width: 95, height: 50, inputs: [true], output: true, label: 'FLAG: ZERO' },
  ],
  wires: [
    { id: 'alw1', fromGateId: 'alu_a', fromPinIndex: 0, toGateId: 'alu_xor1', toPinIndex: 0 },
    { id: 'alw2', fromGateId: 'alu_b', fromPinIndex: 0, toGateId: 'alu_xor1', toPinIndex: 1 },
    { id: 'alw3', fromGateId: 'alu_xor1', fromPinIndex: 0, toGateId: 'alu_xor2', toPinIndex: 0 },
    { id: 'alw4', fromGateId: 'alu_cin', fromPinIndex: 0, toGateId: 'alu_xor2', toPinIndex: 1 },

    { id: 'alw5', fromGateId: 'alu_a', fromPinIndex: 0, toGateId: 'alu_and1', toPinIndex: 0 },
    { id: 'alw6', fromGateId: 'alu_b', fromPinIndex: 0, toGateId: 'alu_and1', toPinIndex: 1 },
    { id: 'alw7', fromGateId: 'alu_xor1', fromPinIndex: 0, toGateId: 'alu_and2', toPinIndex: 0 },
    { id: 'alw8', fromGateId: 'alu_cin', fromPinIndex: 0, toGateId: 'alu_and2', toPinIndex: 1 },

    { id: 'alw9', fromGateId: 'alu_and1', fromPinIndex: 0, toGateId: 'alu_or_c', toPinIndex: 0 },
    { id: 'alw10', fromGateId: 'alu_and2', fromPinIndex: 0, toGateId: 'alu_or_c', toPinIndex: 1 },
    { id: 'alw11', fromGateId: 'alu_or_c', fromPinIndex: 0, toGateId: 'alu_out_cout', toPinIndex: 0 },

    { id: 'alw12', fromGateId: 'alu_a', fromPinIndex: 0, toGateId: 'alu_logic_xor', toPinIndex: 0 },
    { id: 'alw13', fromGateId: 'alu_b', fromPinIndex: 0, toGateId: 'alu_logic_xor', toPinIndex: 1 },

    { id: 'alw14', fromGateId: 'alu_op', fromPinIndex: 0, toGateId: 'alu_not_op', toPinIndex: 0 },
    { id: 'alw15', fromGateId: 'alu_xor2', fromPinIndex: 0, toGateId: 'alu_mux_and0', toPinIndex: 0 },
    { id: 'alw16', fromGateId: 'alu_not_op', fromPinIndex: 0, toGateId: 'alu_mux_and0', toPinIndex: 1 },

    { id: 'alw17', fromGateId: 'alu_logic_xor', fromPinIndex: 0, toGateId: 'alu_mux_and1', toPinIndex: 0 },
    { id: 'alw18', fromGateId: 'alu_op', fromPinIndex: 0, toGateId: 'alu_mux_and1', toPinIndex: 1 },

    { id: 'alw19', fromGateId: 'alu_mux_and0', fromPinIndex: 0, toGateId: 'alu_mux_or', toPinIndex: 0 },
    { id: 'alw20', fromGateId: 'alu_mux_and1', fromPinIndex: 0, toGateId: 'alu_mux_or', toPinIndex: 1 },
    { id: 'alw21', fromGateId: 'alu_mux_or', fromPinIndex: 0, toGateId: 'alu_out_res', toPinIndex: 0 },

    { id: 'alw22', fromGateId: 'alu_mux_or', fromPinIndex: 0, toGateId: 'alu_zero_nor', toPinIndex: 0 },
    { id: 'alw23', fromGateId: 'alu_out_cout', fromPinIndex: 0, toGateId: 'alu_zero_nor', toPinIndex: 1 },
    { id: 'alw24', fromGateId: 'alu_zero_nor', fromPinIndex: 0, toGateId: 'alu_out_zero', toPinIndex: 0 },
  ],
};

const PRESET_CALCULATOR_ARITHMETIC: { gates: LogicGate[]; wires: LogicWire[] } = {
  gates: [
    // Operands
    { id: 'calc_a', type: 'INPUT', x: 50, y: 60, width: 85, height: 50, inputs: [], output: true, label: 'OPERAND A' },
    { id: 'calc_b', type: 'INPUT', x: 50, y: 170, width: 85, height: 50, inputs: [], output: true, label: 'OPERAND B' },
    { id: 'calc_sub', type: 'INPUT', x: 50, y: 280, width: 85, height: 50, inputs: [], output: false, label: 'SUB/ADD (1/0)' },

    // Inverter for subtraction (B ⊕ SUB)
    { id: 'calc_xor_b', type: 'XOR', x: 220, y: 170, width: 90, height: 65, inputs: [true, false], output: true, label: 'B ⊕ SUB' },

    // Arithmetic Adder Core
    { id: 'calc_xor_sum', type: 'XOR', x: 380, y: 65, width: 90, height: 65, inputs: [true, true], output: false, label: 'SUM/DIFF' },
    { id: 'calc_and_carry', type: 'AND', x: 380, y: 170, width: 90, height: 65, inputs: [true, true], output: true, label: 'CARRY/BORROW' },

    // Fast Binary Multiplier (A · B)
    { id: 'calc_and_mul', type: 'AND', x: 380, y: 280, width: 90, height: 65, inputs: [true, true], output: true, label: 'MULTIPLY (A·B)' },

    // Equality Comparator (A == B)
    { id: 'calc_xnor_eq', type: 'XNOR', x: 380, y: 390, width: 90, height: 65, inputs: [true, true], output: true, label: 'COMPARE (A==B)' },

    // Outputs
    { id: 'calc_out_sum', type: 'OUTPUT', x: 560, y: 70, width: 100, height: 50, inputs: [false], output: false, label: 'RESULT (±)' },
    { id: 'calc_out_cout', type: 'OUTPUT', x: 560, y: 175, width: 100, height: 50, inputs: [true], output: true, label: 'CARRY/BORROW' },
    { id: 'calc_out_mul', type: 'OUTPUT', x: 560, y: 285, width: 100, height: 50, inputs: [true], output: true, label: 'PRODUCT (×)' },
    { id: 'calc_out_eq', type: 'OUTPUT', x: 560, y: 395, width: 100, height: 50, inputs: [true], output: true, label: 'EQUAL (A==B)' },
  ],
  wires: [
    { id: 'cw1', fromGateId: 'calc_b', fromPinIndex: 0, toGateId: 'calc_xor_b', toPinIndex: 0 },
    { id: 'cw2', fromGateId: 'calc_sub', fromPinIndex: 0, toGateId: 'calc_xor_b', toPinIndex: 1 },

    { id: 'cw3', fromGateId: 'calc_a', fromPinIndex: 0, toGateId: 'calc_xor_sum', toPinIndex: 0 },
    { id: 'cw4', fromGateId: 'calc_xor_b', fromPinIndex: 0, toGateId: 'calc_xor_sum', toPinIndex: 1 },

    { id: 'cw5', fromGateId: 'calc_a', fromPinIndex: 0, toGateId: 'calc_and_carry', toPinIndex: 0 },
    { id: 'cw6', fromGateId: 'calc_xor_b', fromPinIndex: 0, toGateId: 'calc_and_carry', toPinIndex: 1 },

    { id: 'cw7', fromGateId: 'calc_a', fromPinIndex: 0, toGateId: 'calc_and_mul', toPinIndex: 0 },
    { id: 'cw8', fromGateId: 'calc_b', fromPinIndex: 0, toGateId: 'calc_and_mul', toPinIndex: 1 },

    { id: 'cw9', fromGateId: 'calc_a', fromPinIndex: 0, toGateId: 'calc_xnor_eq', toPinIndex: 0 },
    { id: 'cw10', fromGateId: 'calc_b', fromPinIndex: 0, toGateId: 'calc_xnor_eq', toPinIndex: 1 },

    { id: 'cw11', fromGateId: 'calc_xor_sum', fromPinIndex: 0, toGateId: 'calc_out_sum', toPinIndex: 0 },
    { id: 'cw12', fromGateId: 'calc_and_carry', fromPinIndex: 0, toGateId: 'calc_out_cout', toPinIndex: 0 },
    { id: 'cw13', fromGateId: 'calc_and_mul', fromPinIndex: 0, toGateId: 'calc_out_mul', toPinIndex: 0 },
    { id: 'cw14', fromGateId: 'calc_xnor_eq', fromPinIndex: 0, toGateId: 'calc_out_eq', toPinIndex: 0 },
  ],
};

const PRESET_ARRAY_MULTIPLIER_2BIT: { gates: LogicGate[]; wires: LogicWire[] } = {
  gates: [
    // 2-bit Operands A[1:0] and B[1:0]
    { id: 'mul_a0', type: 'INPUT', x: 50, y: 40, width: 80, height: 50, inputs: [], output: true, label: 'A[0]' },
    { id: 'mul_a1', type: 'INPUT', x: 50, y: 120, width: 80, height: 50, inputs: [], output: true, label: 'A[1]' },
    { id: 'mul_b0', type: 'INPUT', x: 50, y: 210, width: 80, height: 50, inputs: [], output: true, label: 'B[0]' },
    { id: 'mul_b1', type: 'INPUT', x: 50, y: 290, width: 80, height: 50, inputs: [], output: true, label: 'B[1]' },

    // 4 Partial Product AND gates: A0B0, A1B0, A0B1, A1B1
    { id: 'mul_pp00', type: 'AND', x: 230, y: 40, width: 90, height: 65, inputs: [true, true], output: true, label: 'PP00: A0·B0' },
    { id: 'mul_pp10', type: 'AND', x: 230, y: 130, width: 90, height: 65, inputs: [true, true], output: true, label: 'PP10: A1·B0' },
    { id: 'mul_pp01', type: 'AND', x: 230, y: 220, width: 90, height: 65, inputs: [true, true], output: true, label: 'PP01: A0·B1' },
    { id: 'mul_pp11', type: 'AND', x: 230, y: 310, width: 90, height: 65, inputs: [true, true], output: true, label: 'PP11: A1·B1' },

    // Half Adder 1 (adds PP10 and PP01) -> P1 & Carry1
    { id: 'mul_ha1_xor', type: 'XOR', x: 420, y: 140, width: 90, height: 65, inputs: [true, true], output: false, label: 'HA1: XOR' },
    { id: 'mul_ha1_and', type: 'AND', x: 420, y: 230, width: 90, height: 65, inputs: [true, true], output: true, label: 'HA1: CARRY' },

    // Half Adder 2 (adds PP11 and Carry1) -> P2 & P3 (Carry2)
    { id: 'mul_ha2_xor', type: 'XOR', x: 580, y: 260, width: 90, height: 65, inputs: [true, true], output: false, label: 'HA2: XOR' },
    { id: 'mul_ha2_and', type: 'AND', x: 580, y: 350, width: 90, height: 65, inputs: [true, true], output: true, label: 'HA2: CARRY' },

    // Product Outputs (4-bit binary result)
    { id: 'mul_p0', type: 'OUTPUT', x: 420, y: 45, width: 90, height: 50, inputs: [true], output: true, label: 'PROD P[0]' },
    { id: 'mul_p1', type: 'OUTPUT', x: 580, y: 145, width: 90, height: 50, inputs: [false], output: false, label: 'PROD P[1]' },
    { id: 'mul_p2', type: 'OUTPUT', x: 740, y: 265, width: 90, height: 50, inputs: [false], output: false, label: 'PROD P[2]' },
    { id: 'mul_p3', type: 'OUTPUT', x: 740, y: 355, width: 90, height: 50, inputs: [true], output: true, label: 'PROD P[3]' },
  ],
  wires: [
    { id: 'mw_a0_0', fromGateId: 'mul_a0', fromPinIndex: 0, toGateId: 'mul_pp00', toPinIndex: 0 },
    { id: 'mw_b0_0', fromGateId: 'mul_b0', fromPinIndex: 0, toGateId: 'mul_pp00', toPinIndex: 1 },

    { id: 'mw_a1_0', fromGateId: 'mul_a1', fromPinIndex: 0, toGateId: 'mul_pp10', toPinIndex: 0 },
    { id: 'mw_b0_1', fromGateId: 'mul_b0', fromPinIndex: 0, toGateId: 'mul_pp10', toPinIndex: 1 },

    { id: 'mw_a0_1', fromGateId: 'mul_a0', fromPinIndex: 0, toGateId: 'mul_pp01', toPinIndex: 0 },
    { id: 'mw_b1_0', fromGateId: 'mul_b1', fromPinIndex: 0, toGateId: 'mul_pp01', toPinIndex: 1 },

    { id: 'mw_a1_1', fromGateId: 'mul_a1', fromPinIndex: 0, toGateId: 'mul_pp11', toPinIndex: 0 },
    { id: 'mw_b1_1', fromGateId: 'mul_b1', fromPinIndex: 0, toGateId: 'mul_pp11', toPinIndex: 1 },

    { id: 'mw_pp00_p0', fromGateId: 'mul_pp00', fromPinIndex: 0, toGateId: 'mul_p0', toPinIndex: 0 },

    { id: 'mw_ha1_in0', fromGateId: 'mul_pp10', fromPinIndex: 0, toGateId: 'mul_ha1_xor', toPinIndex: 0 },
    { id: 'mw_ha1_in1', fromGateId: 'mul_pp01', fromPinIndex: 0, toGateId: 'mul_ha1_xor', toPinIndex: 1 },
    { id: 'mw_ha1_c0', fromGateId: 'mul_pp10', fromPinIndex: 0, toGateId: 'mul_ha1_and', toPinIndex: 0 },
    { id: 'mw_ha1_c1', fromGateId: 'mul_pp01', fromPinIndex: 0, toGateId: 'mul_ha1_and', toPinIndex: 1 },

    { id: 'mw_ha1_out', fromGateId: 'mul_ha1_xor', fromPinIndex: 0, toGateId: 'mul_p1', toPinIndex: 0 },

    { id: 'mw_ha2_in0', fromGateId: 'mul_pp11', fromPinIndex: 0, toGateId: 'mul_ha2_xor', toPinIndex: 0 },
    { id: 'mw_ha2_in1', fromGateId: 'mul_ha1_and', fromPinIndex: 0, toGateId: 'mul_ha2_xor', toPinIndex: 1 },
    { id: 'mw_ha2_c0', fromGateId: 'mul_pp11', fromPinIndex: 0, toGateId: 'mul_ha2_and', toPinIndex: 0 },
    { id: 'mw_ha2_c1', fromGateId: 'mul_ha1_and', fromPinIndex: 0, toGateId: 'mul_ha2_and', toPinIndex: 1 },

    { id: 'mw_ha2_out', fromGateId: 'mul_ha2_xor', fromPinIndex: 0, toGateId: 'mul_p2', toPinIndex: 0 },
    { id: 'mw_ha2_cout', fromGateId: 'mul_ha2_and', fromPinIndex: 0, toGateId: 'mul_p3', toPinIndex: 0 },
  ],
};

const PRESET_ADDER_SUBTRACTOR_4BIT: { gates: LogicGate[]; wires: LogicWire[] } = {
  gates: [
    // Control & Operands
    { id: 'as_ctrl', type: 'INPUT', x: 50, y: 30, width: 85, height: 50, inputs: [], output: false, label: 'SUB/ADD' },
    { id: 'as_a0', type: 'INPUT', x: 50, y: 100, width: 80, height: 50, inputs: [], output: true, label: 'A[0]' },
    { id: 'as_b0', type: 'INPUT', x: 50, y: 170, width: 80, height: 50, inputs: [], output: false, label: 'B[0]' },
    { id: 'as_a1', type: 'INPUT', x: 50, y: 260, width: 80, height: 50, inputs: [], output: true, label: 'A[1]' },
    { id: 'as_b1', type: 'INPUT', x: 50, y: 330, width: 80, height: 50, inputs: [], output: true, label: 'B[1]' },

    // B-Inversion XORs for 2's Complement Subtraction
    { id: 'as_inv_b0', type: 'XOR', x: 220, y: 170, width: 90, height: 65, inputs: [false, false], output: false, label: 'B0 ⊕ SUB' },
    { id: 'as_inv_b1', type: 'XOR', x: 220, y: 330, width: 90, height: 65, inputs: [true, false], output: true, label: 'B1 ⊕ SUB' },

    // Bit 0 Full Adder
    { id: 'as_fa0_xor1', type: 'XOR', x: 370, y: 100, width: 90, height: 65, inputs: [true, false], output: true, label: 'A0 ⊕ B0\'' },
    { id: 'as_fa0_xor2', type: 'XOR', x: 520, y: 100, width: 90, height: 65, inputs: [true, false], output: true, label: 'SUM 0' },
    { id: 'as_fa0_and', type: 'AND', x: 370, y: 180, width: 90, height: 65, inputs: [true, false], output: false, label: 'CARRY 0' },

    // Bit 1 Full Adder
    { id: 'as_fa1_xor1', type: 'XOR', x: 520, y: 260, width: 90, height: 65, inputs: [true, true], output: false, label: 'A1 ⊕ B1\'' },
    { id: 'as_fa1_xor2', type: 'XOR', x: 670, y: 260, width: 90, height: 65, inputs: [false, false], output: false, label: 'SUM 1' },
    { id: 'as_fa1_and', type: 'AND', x: 520, y: 340, width: 90, height: 65, inputs: [true, true], output: true, label: 'CARRY 1' },

    // Outputs
    { id: 'as_out_s0', type: 'OUTPUT', x: 670, y: 105, width: 90, height: 50, inputs: [true], output: true, label: 'SUM [0]' },
    { id: 'as_out_s1', type: 'OUTPUT', x: 820, y: 265, width: 90, height: 50, inputs: [false], output: false, label: 'SUM [1]' },
    { id: 'as_out_cout', type: 'OUTPUT', x: 670, y: 345, width: 90, height: 50, inputs: [true], output: true, label: 'CARRY OUT' },
  ],
  wires: [
    { id: 'asw1', fromGateId: 'as_b0', fromPinIndex: 0, toGateId: 'as_inv_b0', toPinIndex: 0 },
    { id: 'asw2', fromGateId: 'as_ctrl', fromPinIndex: 0, toGateId: 'as_inv_b0', toPinIndex: 1 },

    { id: 'asw3', fromGateId: 'as_b1', fromPinIndex: 0, toGateId: 'as_inv_b1', toPinIndex: 0 },
    { id: 'asw4', fromGateId: 'as_ctrl', fromPinIndex: 0, toGateId: 'as_inv_b1', toPinIndex: 1 },

    { id: 'asw5', fromGateId: 'as_a0', fromPinIndex: 0, toGateId: 'as_fa0_xor1', toPinIndex: 0 },
    { id: 'asw6', fromGateId: 'as_inv_b0', fromPinIndex: 0, toGateId: 'as_fa0_xor1', toPinIndex: 1 },

    { id: 'asw7', fromGateId: 'as_fa0_xor1', fromPinIndex: 0, toGateId: 'as_fa0_xor2', toPinIndex: 0 },
    { id: 'asw8', fromGateId: 'as_ctrl', fromPinIndex: 0, toGateId: 'as_fa0_xor2', toPinIndex: 1 },

    { id: 'asw9', fromGateId: 'as_a0', fromPinIndex: 0, toGateId: 'as_fa0_and', toPinIndex: 0 },
    { id: 'asw10', fromGateId: 'as_inv_b0', fromPinIndex: 0, toGateId: 'as_fa0_and', toPinIndex: 1 },

    { id: 'asw11', fromGateId: 'as_fa0_xor2', fromPinIndex: 0, toGateId: 'as_out_s0', toPinIndex: 0 },

    { id: 'asw12', fromGateId: 'as_a1', fromPinIndex: 0, toGateId: 'as_fa1_xor1', toPinIndex: 0 },
    { id: 'asw13', fromGateId: 'as_inv_b1', fromPinIndex: 0, toGateId: 'as_fa1_xor1', toPinIndex: 1 },

    { id: 'asw14', fromGateId: 'as_fa1_xor1', fromPinIndex: 0, toGateId: 'as_fa1_xor2', toPinIndex: 0 },
    { id: 'asw15', fromGateId: 'as_fa0_and', fromPinIndex: 0, toGateId: 'as_fa1_xor2', toPinIndex: 1 },

    { id: 'asw16', fromGateId: 'as_a1', fromPinIndex: 0, toGateId: 'as_fa1_and', toPinIndex: 0 },
    { id: 'asw17', fromGateId: 'as_inv_b1', fromPinIndex: 0, toGateId: 'as_fa1_and', toPinIndex: 1 },

    { id: 'asw18', fromGateId: 'as_fa1_xor2', fromPinIndex: 0, toGateId: 'as_out_s1', toPinIndex: 0 },
    { id: 'asw19', fromGateId: 'as_fa1_and', fromPinIndex: 0, toGateId: 'as_out_cout', toPinIndex: 0 },
  ],
};

const PRESET_SEQUENCE_DETECTOR: { gates: LogicGate[]; wires: LogicWire[] } = {
  gates: [
    { id: 'fsm_clk', type: 'INPUT', x: 50, y: 60, width: 85, height: 50, inputs: [], output: true, label: 'CLOCK PULSE' },
    { id: 'fsm_din', type: 'INPUT', x: 50, y: 160, width: 85, height: 50, inputs: [], output: true, label: 'STREAM BIT' },
    { id: 'fsm_rst', type: 'INPUT', x: 50, y: 260, width: 85, height: 50, inputs: [], output: false, label: 'RESET' },

    // State Register Bit 0 (Latched)
    { id: 'fsm_nor1', type: 'NOR', x: 250, y: 60, width: 90, height: 65, inputs: [false, false], output: true, label: 'REG 0 NOR1' },
    { id: 'fsm_nor2', type: 'NOR', x: 250, y: 160, width: 90, height: 65, inputs: [true, false], output: false, label: 'REG 0 NOR2' },

    // Sequence recognition logic: Detects pattern 1-0-1
    { id: 'fsm_and_match', type: 'AND', x: 440, y: 110, width: 90, height: 65, inputs: [true, true], output: true, label: 'PATTERN DECODE' },
    { id: 'fsm_out_match', type: 'OUTPUT', x: 620, y: 115, width: 95, height: 50, inputs: [true], output: true, label: 'SEQUENCE FOUND' },
    { id: 'fsm_out_state', type: 'OUTPUT', x: 440, y: 215, width: 95, height: 50, inputs: [false], output: false, label: 'STATE BIT Q0' },
  ],
  wires: [
    { id: 'fsm_w1', fromGateId: 'fsm_rst', fromPinIndex: 0, toGateId: 'fsm_nor1', toPinIndex: 0 },
    { id: 'fsm_w2', fromGateId: 'fsm_nor2', fromPinIndex: 0, toGateId: 'fsm_nor1', toPinIndex: 1 },
    { id: 'fsm_w3', fromGateId: 'fsm_nor1', fromPinIndex: 0, toGateId: 'fsm_nor2', toPinIndex: 0 },
    { id: 'fsm_w4', fromGateId: 'fsm_clk', fromPinIndex: 0, toGateId: 'fsm_nor2', toPinIndex: 1 },

    { id: 'fsm_w5', fromGateId: 'fsm_nor1', fromPinIndex: 0, toGateId: 'fsm_and_match', toPinIndex: 0 },
    { id: 'fsm_w6', fromGateId: 'fsm_din', fromPinIndex: 0, toGateId: 'fsm_and_match', toPinIndex: 1 },
    { id: 'fsm_w7', fromGateId: 'fsm_and_match', fromPinIndex: 0, toGateId: 'fsm_out_match', toPinIndex: 0 },
    { id: 'fsm_w8', fromGateId: 'fsm_nor2', fromPinIndex: 0, toGateId: 'fsm_out_state', toPinIndex: 0 },
  ],
};


const GATE_SPECS: Record<
  GateType,
  { name: string; inputCount: number; evaluate: (inputs: boolean[]) => boolean }
> = {
  INPUT: { name: 'INPUT SWITCH', inputCount: 0, evaluate: () => false },
  OUTPUT: { name: 'OUTPUT LED', inputCount: 1, evaluate: (inps) => Boolean(inps[0]) },
  AND: { name: 'AND GATE', inputCount: 2, evaluate: (inps) => Boolean(inps[0]) && Boolean(inps[1]) },
  OR: { name: 'OR GATE', inputCount: 2, evaluate: (inps) => Boolean(inps[0]) || Boolean(inps[1]) },
  NOT: { name: 'NOT GATE', inputCount: 1, evaluate: (inps) => !Boolean(inps[0]) },
  XOR: { name: 'XOR GATE', inputCount: 2, evaluate: (inps) => Boolean(inps[0]) !== Boolean(inps[1]) },
  NAND: { name: 'NAND GATE', inputCount: 2, evaluate: (inps) => !(Boolean(inps[0]) && Boolean(inps[1])) },
  NOR: { name: 'NOR GATE', inputCount: 2, evaluate: (inps) => !(Boolean(inps[0]) || Boolean(inps[1])) },
  XNOR: { name: 'XNOR GATE', inputCount: 2, evaluate: (inps) => Boolean(inps[0]) === Boolean(inps[1]) },
};

export const CircuitLab: React.FC = () => {
  const [gates, setGates] = useState<LogicGate[]>(PRESET_HALF_ADDER.gates);
  const [wires, setWires] = useState<LogicWire[]>(PRESET_HALF_ADDER.wires);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [gateSizeScale, setGateSizeScale] = useState<number>(1); // 0.8, 1, 1.2
  const [showTruthTable, setShowTruthTable] = useState<boolean>(false);

  // Dragging state
  const [draggingGateId, setDraggingGateId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Wiring creation state
  const [wiringStart, setWiringStart] = useState<{ gateId: string; pinIndex: number } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<SVGSVGElement | null>(null);

  // Propagate signals across the circuit
  const propagateSignals = useCallback((currentGates: LogicGate[], currentWires: LogicWire[]) => {
    const updated = currentGates.map((g) => ({
      ...g,
      inputs: Array(GATE_SPECS[g.type].inputCount).fill(false),
    }));

    // Topological evaluation passes
    for (let pass = 0; pass < 6; pass++) {
      for (const wire of currentWires) {
        const source = updated.find((g) => g.id === wire.fromGateId);
        const target = updated.find((g) => g.id === wire.toGateId);
        if (source && target && wire.toPinIndex < target.inputs.length) {
          target.inputs[wire.toPinIndex] = source.output;
        }
      }

      for (const gate of updated) {
        if (gate.type === 'INPUT') {
          // Output retained from user toggle
        } else {
          gate.output = GATE_SPECS[gate.type].evaluate(gate.inputs);
        }
      }
    }

    return updated;
  }, []);

  // Recalculate whenever inputs or wires change
  useEffect(() => {
    setGates((prevGates) => propagateSignals(prevGates, wires));
  }, [wires, propagateSignals]);

  // Handle Input Switch Toggle
  const handleToggleInput = (gateId: string) => {
    setGates((prev) => {
      const next = prev.map((g) => (g.id === gateId ? { ...g, output: !g.output } : g));
      return propagateSignals(next, wires);
    });
  };

  // Add Gate to Canvas
  const handleAddGate = (type: GateType) => {
    const spec = GATE_SPECS[type];
    const newId = `${type.toLowerCase()}_${Date.now().toString().slice(-4)}`;
    const baseW = type === 'INPUT' || type === 'OUTPUT' ? 80 : 90;
    const baseH = spec.inputCount === 1 ? 55 : 65;

    const newGate: LogicGate = {
      id: newId,
      type,
      x: 180 + Math.floor(Math.random() * 80),
      y: 120 + Math.floor(Math.random() * 80),
      width: Math.round(baseW * gateSizeScale),
      height: Math.round(baseH * gateSizeScale),
      inputs: Array(spec.inputCount).fill(false),
      output: false,
      label: type,
    };

    setGates((prev) => propagateSignals([...prev, newGate], wires));
  };

  // Pin coordinates calculation
  const getPinCoords = (gate: LogicGate, isInput: boolean, pinIndex: number) => {
    const scale = gateSizeScale;
    const w = gate.width;
    const h = gate.height;

    if (isInput) {
      const inputCount = GATE_SPECS[gate.type].inputCount;
      const spacing = h / (inputCount + 1);
      return {
        x: gate.x,
        y: gate.y + spacing * (pinIndex + 1),
      };
    } else {
      return {
        x: gate.x + w,
        y: gate.y + h / 2,
      };
    }
  };

  // Mouse coordinate helper inside SVG
  const getSvgPoint = (e: React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoomLevel,
      y: (e.clientY - rect.top) / zoomLevel,
    };
  };

  // Dragging Gate
  const handleMouseDownGate = (e: React.MouseEvent, gate: LogicGate) => {
    e.stopPropagation();
    const pt = getSvgPoint(e);
    setDraggingGateId(gate.id);
    setDragOffset({ x: pt.x - gate.x, y: pt.y - gate.y });
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    const pt = getSvgPoint(e);
    setMousePos(pt);

    if (draggingGateId) {
      setGates((prev) =>
        prev.map((g) => {
          if (g.id === draggingGateId) {
            return {
              ...g,
              x: Math.max(10, Math.round(pt.x - dragOffset.x)),
              y: Math.max(10, Math.round(pt.y - dragOffset.y)),
            };
          }
          return g;
        })
      );
    }
  };

  const handleMouseUpCanvas = () => {
    setDraggingGateId(null);
  };

  // Wire Connection Handlers
  const handleStartWiring = (e: React.MouseEvent, gateId: string, pinIndex: number) => {
    e.stopPropagation();
    setWiringStart({ gateId, pinIndex });
  };

  const handleFinishWiring = (e: React.MouseEvent, targetGateId: string, targetPinIndex: number) => {
    e.stopPropagation();
    if (!wiringStart) return;

    // Prevent connecting gate to itself
    if (wiringStart.gateId === targetGateId) {
      setWiringStart(null);
      return;
    }

    // Check if target pin already has a wire, remove it
    const filteredWires = wires.filter(
      (w) => !(w.toGateId === targetGateId && w.toPinIndex === targetPinIndex)
    );

    const newWire: LogicWire = {
      id: `wire_${Date.now().toString().slice(-5)}`,
      fromGateId: wiringStart.gateId,
      fromPinIndex: wiringStart.pinIndex,
      toGateId: targetGateId,
      toPinIndex: targetPinIndex,
    };

    setWires([...filteredWires, newWire]);
    setWiringStart(null);
  };

  const handleDeleteWire = (wireId: string) => {
    setWires((prev) => prev.filter((w) => w.id !== wireId));
  };

  const handleDeleteGate = (gateId: string) => {
    setGates((prev) => prev.filter((g) => g.id !== gateId));
    setWires((prev) => prev.filter((w) => w.fromGateId !== gateId && w.toGateId !== gateId));
  };

  type CircuitPresetKey = 'half_adder' | 'full_adder' | 'mux_2to1' | 'sr_latch' | 'comparator_2bit' | 'alu_processor' | 'calculator_arithmetic' | 'array_multiplier_2bit' | 'adder_subtractor_4bit' | 'sequence_detector' | 'blank';

  const handleLoadPreset = (preset: CircuitPresetKey) => {
    switch (preset) {
      case 'half_adder':
        setGates(PRESET_HALF_ADDER.gates);
        setWires(PRESET_HALF_ADDER.wires);
        break;
      case 'full_adder':
        setGates(PRESET_FULL_ADDER.gates);
        setWires(PRESET_FULL_ADDER.wires);
        break;
      case 'mux_2to1':
        setGates(PRESET_MUX_2TO1.gates);
        setWires(PRESET_MUX_2TO1.wires);
        break;
      case 'sr_latch':
        setGates(PRESET_SR_LATCH.gates);
        setWires(PRESET_SR_LATCH.wires);
        break;
      case 'comparator_2bit':
        setGates(PRESET_COMPARATOR_2BIT.gates);
        setWires(PRESET_COMPARATOR_2BIT.wires);
        break;
      case 'alu_processor':
        setGates(PRESET_ALU_PROCESSOR.gates);
        setWires(PRESET_ALU_PROCESSOR.wires);
        break;
      case 'calculator_arithmetic':
        setGates(PRESET_CALCULATOR_ARITHMETIC.gates);
        setWires(PRESET_CALCULATOR_ARITHMETIC.wires);
        break;
      case 'array_multiplier_2bit':
        setGates(PRESET_ARRAY_MULTIPLIER_2BIT.gates);
        setWires(PRESET_ARRAY_MULTIPLIER_2BIT.wires);
        break;
      case 'adder_subtractor_4bit':
        setGates(PRESET_ADDER_SUBTRACTOR_4BIT.gates);
        setWires(PRESET_ADDER_SUBTRACTOR_4BIT.wires);
        break;
      case 'sequence_detector':
        setGates(PRESET_SEQUENCE_DETECTOR.gates);
        setWires(PRESET_SEQUENCE_DETECTOR.wires);
        break;
      case 'blank':
      default:
        setGates([]);
        setWires([]);
        break;
    }
  };

  // Generate dynamic truth table based on all INPUT and OUTPUT gates
  const truthTableData = useMemo(() => {
    const inputGates = gates.filter((g) => g.type === 'INPUT');
    const outputGates = gates.filter((g) => g.type === 'OUTPUT');

    if (inputGates.length === 0 || inputGates.length > 4) {
      return null;
    }

    const rowsCount = Math.pow(2, inputGates.length);
    const rows = [];

    for (let i = 0; i < rowsCount; i++) {
      const inputVals: boolean[] = [];
      for (let bit = inputGates.length - 1; bit >= 0; bit--) {
        inputVals.push(Boolean((i >> bit) & 1));
      }

      // Simulate
      const simGates = gates.map((g) => {
        const inpIdx = inputGates.findIndex((ig) => ig.id === g.id);
        if (inpIdx >= 0) {
          return { ...g, output: inputVals[inpIdx] };
        }
        return { ...g };
      });

      const evaluated = propagateSignals(simGates, wires);

      const outVals = outputGates.map((og) => {
        const found = evaluated.find((g) => g.id === og.id);
        return found ? found.output : false;
      });

      rows.push({ inputVals, outVals });
    }

    return { inputGates, outputGates, rows };
  }, [gates, wires, propagateSignals]);

  return (
    <div
      id="circuit-lab-root"
      className="h-full w-full flex flex-col bg-[#07090e] text-zinc-100 select-none overflow-hidden"
    >
      {/* Top Toolbar */}
      <div
        id="circuit-toolbar"
        className="h-14 bg-[#0c1017] border-b border-zinc-800 px-4 flex flex-wrap items-center justify-between gap-3 shrink-0 z-10"
      >
        {/* Gate Catalog Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-mono text-zinc-400 uppercase mr-1 hidden sm:inline">
            ADD:
          </span>

          <button
            id="btn-add-input"
            onClick={() => handleAddGate('INPUT')}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold"
          >
            + SWITCH
          </button>

          <button
            id="btn-add-output"
            onClick={() => handleAddGate('OUTPUT')}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold"
          >
            + LED
          </button>

          {(['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR', 'XNOR'] as GateType[]).map((gt) => (
            <button
              key={gt}
              id={`btn-add-${gt.toLowerCase()}`}
              onClick={() => handleAddGate(gt)}
              className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-mono"
            >
              {gt}
            </button>
          ))}
        </div>

        {/* Canvas Controls: Zoom, Scale, Presets, Truth Table */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Gate Scale Slider */}
          <div className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
            <span className="text-[10px] text-zinc-400">SCALE:</span>
            <button
              onClick={() => setGateSizeScale(0.85)}
              className={`px-1.5 py-0.5 rounded ${gateSizeScale === 0.85 ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-400'}`}
            >
              S
            </button>
            <button
              onClick={() => setGateSizeScale(1)}
              className={`px-1.5 py-0.5 rounded ${gateSizeScale === 1 ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-400'}`}
            >
              M
            </button>
            <button
              onClick={() => setGateSizeScale(1.2)}
              className={`px-1.5 py-0.5 rounded ${gateSizeScale === 1.2 ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-400'}`}
            >
              L
            </button>
          </div>

          <button
            id="btn-truth-table"
            onClick={() => setShowTruthTable(!showTruthTable)}
            className={`px-2.5 py-1 rounded border flex items-center gap-1 transition-all ${
              showTruthTable
                ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                : 'bg-zinc-800 border-zinc-700 text-zinc-300'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Truth Table</span>
          </button>

          {/* Presets & Blueprints */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-[10px] text-zinc-400 hidden sm:inline font-mono">BLUEPRINT:</span>
            <select
              id="select-circuit-preset"
              onChange={(e) => handleLoadPreset(e.target.value as any)}
              className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer text-xs"
              defaultValue="half_adder"
            >
              <option value="half_adder" className="bg-zinc-900">Half Adder (2 Gates)</option>
              <option value="full_adder" className="bg-zinc-900">Full Adder (5 Gates)</option>
              <option value="mux_2to1" className="bg-zinc-900">2:1 Multiplexer (MUX)</option>
              <option value="sr_latch" className="bg-zinc-900">SR Latch (Memory)</option>
              <option value="comparator_2bit" className="bg-zinc-900">2-Bit Comparator</option>
              <option value="alu_processor" className="bg-zinc-900 font-bold text-pink-400">★ 4-Bit ALU / Processor Core</option>
              <option value="calculator_arithmetic" className="bg-zinc-900 font-bold text-purple-400">★ 4-Function Digital Calculator</option>
              <option value="array_multiplier_2bit" className="bg-zinc-900 font-bold text-pink-400">★ 2-Bit Binary Array Multiplier</option>
              <option value="adder_subtractor_4bit" className="bg-zinc-900 font-bold text-indigo-400">★ 4-Bit Adder / Subtractor (2's Compl)</option>
              <option value="sequence_detector" className="bg-zinc-900 font-bold text-cyan-400">★ Sequence Detector FSM (101)</option>
              <option value="blank" className="bg-zinc-900">Blank Canvas</option>
            </select>
          </div>

          <button
            id="btn-clear-circuit"
            onClick={() => handleLoadPreset('blank')}
            className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-400 border border-zinc-700 cursor-pointer"
            title="Clear Canvas"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas + Interactive Wires with Schematic Blueprint Grid */}
      <div
        className="flex-1 relative overflow-hidden blueprint-canvas cursor-crosshair"
        onMouseMove={handleMouseMoveCanvas}
        onMouseUp={handleMouseUpCanvas}
      >
        <svg
          ref={canvasRef}
          className="w-full h-full absolute inset-0"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: '0 0' }}
        >
          {/* Wire rendering */}
          {wires.map((wire) => {
            const sourceGate = gates.find((g) => g.id === wire.fromGateId);
            const targetGate = gates.find((g) => g.id === wire.toGateId);
            if (!sourceGate || !targetGate) return null;

            const p1 = getPinCoords(sourceGate, false, wire.fromPinIndex);
            const p2 = getPinCoords(targetGate, true, wire.toPinIndex);

            const isHigh = sourceGate.output;
            const deltaX = Math.abs(p2.x - p1.x) * 0.5;
            const pathD = `M ${p1.x} ${p1.y} C ${p1.x + deltaX} ${p1.y}, ${p2.x - deltaX} ${p2.y}, ${p2.x} ${p2.y}`;

            return (
              <g key={wire.id} className="group cursor-pointer">
                {/* Wider invisible hit area */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={14}
                  onClick={() => handleDeleteWire(wire.id)}
                />
                {/* Visible wire */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isHigh ? '#06b6d4' : '#334155'}
                  strokeWidth={isHigh ? 3 : 2}
                  className="transition-colors duration-150"
                  filter={isHigh ? 'drop-shadow(0 0 6px #06b6d4)' : 'none'}
                />
              </g>
            );
          })}

          {/* Pending wire being dragged */}
          {wiringStart && (() => {
            const startGate = gates.find((g) => g.id === wiringStart.gateId);
            if (!startGate) return null;
            const startPin = getPinCoords(startGate, false, wiringStart.pinIndex);
            return (
              <path
                d={`M ${startPin.x} ${startPin.y} C ${mousePos.x + 50} ${mousePos.y}, ${mousePos.x} ${mousePos.y}, ${mousePos.x} ${mousePos.y}`}
                fill="none"
                stroke="#06b6d4"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            );
          })()}

          {/* Gates rendered directly inside SVG for precision */}
          {gates.map((gate) => {
            const spec = GATE_SPECS[gate.type];
            const isSelected = draggingGateId === gate.id;
            const isInputSwitch = gate.type === 'INPUT';
            const isOutputLed = gate.type === 'OUTPUT';

            return (
              <g
                key={gate.id}
                id={`gate-node-${gate.id}`}
                transform={`translate(${gate.x}, ${gate.y})`}
                className="cursor-move"
                onMouseDown={(e) => handleMouseDownGate(e, gate)}
              >
                {/* Gate Body Card */}
                <rect
                  width={gate.width}
                  height={gate.height}
                  rx={8}
                  fill={isInputSwitch ? '#0a1420' : isOutputLed ? '#17120a' : '#0d1117'}
                  stroke={
                    isSelected
                      ? '#06b6d4'
                      : isInputSwitch
                      ? '#0284c7'
                      : isOutputLed
                      ? '#d97706'
                      : '#27272a'
                  }
                  strokeWidth={isSelected ? 2 : 1.5}
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
                />

                {/* Gate Label */}
                <text
                  x={gate.width / 2}
                  y={gate.height / 2 - (isInputSwitch || isOutputLed ? 2 : 6)}
                  textAnchor="middle"
                  fill="#f4f4f5"
                  fontSize={11}
                  fontWeight="bold"
                  fontFamily="monospace"
                  pointerEvents="none"
                >
                  {gate.label || gate.type}
                </text>

                {/* Gate Subtitle or Output Value */}
                <text
                  x={gate.width / 2}
                  y={gate.height / 2 + 12}
                  textAnchor="middle"
                  fill={gate.output ? '#06b6d4' : '#71717a'}
                  fontSize={10}
                  fontWeight="bold"
                  fontFamily="monospace"
                  pointerEvents="none"
                >
                  {isInputSwitch
                    ? `[${gate.output ? 'HIGH (1)' : 'LOW (0)'}]`
                    : isOutputLed
                    ? `STATE: ${gate.output ? '1' : '0'}`
                    : `OUT: ${gate.output ? '1' : '0'}`}
                </text>

                {/* Interactive Toggle for Input Switches */}
                {isInputSwitch && (
                  <circle
                    cx={gate.width / 2}
                    cy={gate.height / 2 + 10}
                    r={12}
                    fill="transparent"
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleInput(gate.id);
                    }}
                  />
                )}

                {/* Input Pins (Left side) */}
                {Array.from({ length: spec.inputCount }).map((_, pIdx) => {
                  const coords = getPinCoords(gate, true, pIdx);
                  const pinVal = gate.inputs[pIdx] || false;
                  return (
                    <g
                      key={pIdx}
                      className="cursor-pointer"
                      onClick={(e) => handleFinishWiring(e, gate.id, pIdx)}
                    >
                      <circle
                        cx={0}
                        cy={coords.y - gate.y}
                        r={6}
                        fill={pinVal ? '#06b6d4' : '#18181b'}
                        stroke={pinVal ? '#22d3ee' : '#52525b'}
                        strokeWidth={2}
                      />
                      <title>{`Input ${pIdx + 1} (${pinVal ? '1' : '0'})`}</title>
                    </g>
                  );
                })}

                {/* Output Pin (Right side) - except for OUTPUT LED */}
                {!isOutputLed && (
                  <g
                    className="cursor-pointer"
                    onMouseDown={(e) => handleStartWiring(e, gate.id, 0)}
                  >
                    <circle
                      cx={gate.width}
                      cy={gate.height / 2}
                      r={7}
                      fill={gate.output ? '#06b6d4' : '#18181b'}
                      stroke={gate.output ? '#22d3ee' : '#52525b'}
                      strokeWidth={2}
                      filter={gate.output ? 'drop-shadow(0 0 6px #06b6d4)' : 'none'}
                    />
                    <title>Output Pin (Click & Drag to Connect)</title>
                  </g>
                )}

                {/* Delete button (small 'x' on top right) */}
                <g
                  className="cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteGate(gate.id);
                  }}
                >
                  <circle cx={gate.width - 8} cy={8} r={5} fill="#ef4444" />
                </g>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Truth Table Modal / Floating Card */}
        {showTruthTable && truthTableData && (
          <div className="absolute right-4 bottom-4 bg-[#0d1117]/95 border border-cyan-500/40 rounded-xl p-4 shadow-2xl z-20 max-w-sm max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-3">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                CIRCUIT TRUTH TABLE
              </span>
              <button
                onClick={() => setShowTruthTable(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <table className="w-full text-center font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  {truthTableData.inputGates.map((g) => (
                    <th key={g.id} className="p-1 text-cyan-400 font-bold">{g.label || g.id}</th>
                  ))}
                  <th className="p-1 text-zinc-500">|</th>
                  {truthTableData.outputGates.map((g) => (
                    <th key={g.id} className="p-1 text-amber-400 font-bold">{g.label || g.id}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {truthTableData.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-zinc-900/60 hover:bg-zinc-800/40">
                    {row.inputVals.map((v, i) => (
                      <td key={i} className="p-1 text-zinc-300">{v ? '1' : '0'}</td>
                    ))}
                    <td className="p-1 text-zinc-500">|</td>
                    {row.outVals.map((v, i) => (
                      <td
                        key={i}
                        className={`p-1 font-bold ${v ? 'text-cyan-400' : 'text-zinc-500'}`}
                      >
                        {v ? '1' : '0'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
