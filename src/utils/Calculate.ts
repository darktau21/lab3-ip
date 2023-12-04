import { Model } from "../model.type";

type Res = { formula: string; res: number };

export enum TransactionResults {
  DROP = "Выпадение",
  SUCCESSFUL = "Выдача без ошибок",
  REPEAT = "Стирание и повтор",
}

export class Calculate {
  // Pпп =(1+ Pош 1)m – вероятность правильного решения в ПК(прямом канале)
  public successProbInDirectCh: Res;

  public successProbReversedCha: Res;

  // вероятность приема с ошибками
  public successWithErrors: Res;

  // вероятность не обнаружения ошибки в ПК
  public errorUnrecog: Res;

  // вероятность обнаружения ошибки в ПК
  public errorDirect: Res;
  // вероятность выдачи сообщения с ошибкой
  public msgWithError: Res;

  public acceptProbError: Res;

  public errorSuccess: Res;

  public avgTransMsg: Res;


  constructor(private model: Model) {
    this.successProbInDirectCh = this.calcSuccessProbInDirectCh();
    this.successProbReversedCha = this.calcSuccesProbReversedCh();
    this.successWithErrors = this.calcSuccessWithErrors();
    this.errorUnrecog = this.calcErrorUnrecog();
    this.errorDirect = this.calcErrorDirect();
    this.msgWithError = this.calcMsgWithError();
    this.acceptProbError = this.calcAcceptProbError();
    this.errorSuccess = this.calcErrorSuccess();
    this.avgTransMsg = this.calcAvgTransMsg();
  }

  private calcSuccessProbInDirectCh() {
    return {
      formula: `(1 - ${this.model.directChannel})^${this.model.digitsNumber}`,
      res: (1 - this.model.directChannel) ** this.model.digitsNumber,
    };
  }

  private calcSuccesProbReversedCh() {
    return { res: ((1 - this.model.directChannel) ** this.model.digitsNumber) * ((1 - this.model.reversedChannel) ** this.model.digitsNumber), formula: `
    (1 - ${this.model.directChannel})^${this.model.digitsNumber} * (1 - ${this.model.reversedChannel})^${this.model.digitsNumber}
    ` };
  }

  private calcSuccessWithErrors(): Res {
    return {
      res: 1 - this.successProbInDirectCh.res,
      formula: `1 - ${this.successProbInDirectCh.res.toFixed(3)}`
    }
  }

  private calcErrorUnrecog(): Res {
    return {
      res: (1-this.model.directChannel) ** (2 * (this.model.digitsNumber - 1)),
      formula: `(1 - ${this.model.directChannel})^${(2 * (this.model.digitsNumber - 1))}`
    }
  }

  private calcErrorDirect(): Res {
    return {
      res: 1 - this.successProbReversedCha.res - this.errorUnrecog.res,
      formula: `1 - ${this.successProbReversedCha.res.toFixed(3)} - ${this.errorUnrecog.res.toFixed(3)}`
    }
  }

  private calcMsgWithError(): Res {
    return {
      res: this.errorUnrecog.res / (1 - this.errorDirect.res),
      formula: `${this.errorUnrecog.res.toFixed(3)} / (1 - ${this.errorDirect.res.toFixed(3)})`
    }
  }

  private calcAcceptProbError(): Res {
    return {
      res: (this.model.reliability * this.msgWithError.res * (1 - this.errorDirect.res)) / (1 - 2 * this.model.reliability * this.msgWithError.res * this.errorDirect.res),
      formula: `
      (${this.model.reliability} * ${this.msgWithError.res.toFixed(3)} * (1 - ${this.errorDirect.res.toFixed(3)})) / (1 - 2 * ${this.model.reliability} * ${this.msgWithError.res.toFixed(3)} * ${this.errorDirect.res.toFixed(3)})
      `
    }
  }

  private calcErrorSuccess(): Res {
    let res = 0;
    let formula = '';

    for (let i = 3; i < 4; i++) {
      res += factorialize(this.model.digitsNumber) / (factorialize(i) * factorialize(this.model.digitsNumber - i))
      formula += `+ ${this.model.digitsNumber}! / (${i}! * (${this.model.digitsNumber} - ${i})!)`
      res *= (this.model.directChannel ** i) * (1 - this.model.directChannel ** i) ** (this.model.digitsNumber - i)
      formula += `* ${this.model.directChannel}^${i} * (1 - ${this.model.directChannel}^${i})^(${this.model.digitsNumber - i})`
    }

    return {
      res, formula
    }
  }

  private calcAvgTransMsg() {
    return {
      res: 1 / (1 - this.errorDirect.res),
      formula: `1 / (1 - ${this.errorDirect.res.toFixed(3)})`
    }
  }

  public modeling(msgCount: number) {
    const res = {
      success: 0,
      repeat: 0,
      drop: 0,
    }

    let i = 0;
    while (i < msgCount) {
      if (Math.random() <= this.successProbInDirectCh.res) {
        res.success++;
        i++;
        continue;
      }

      if (Math.random() <= this.successWithErrors.res) {
        res.drop++;
        i++;
        continue;
      }

      res.repeat++;
      i++;
    }

    return res
  }
}

function factorialize(num: number): number {
  if (num < 0) return -1;
  else if (num == 0) return 1;
  else {
    return num * factorialize(num - 1);
  }
}
