import { Box, Divider, Typography } from "@mui/material";
import { useModel } from "../context/ModelContext";
import { Calculate } from "../utils/Calculate";

export const Calculations = () => {
  const { model } = useModel();

  const calculations = new Calculate(model);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <Typography variant="h5" component={"p"}>
        Pпр = (1+ Pош1)^m – вероятность правильного решения в ПК(прямом канале)
        <br />
        {calculations.successProbInDirectCh.formula} ={" "}
        {calculations.successProbInDirectCh.res.toFixed(3)}
      </Typography>
      <Divider />
      <Typography variant="h5" component={"p"}>
        Pпп - вероятность правильного сигнала из обратного канала
        <br />
        {calculations.successProbReversedCha.formula} ={" "}
        {calculations.successProbReversedCha.res.toFixed(3)}
      </Typography>
      <Divider />
      <Typography variant="h5" component={"p"}>
        Pнпр - вероятность приема с ошибками
        <br />
        {calculations.successWithErrors.formula} ={" "}
        {calculations.successWithErrors.res.toFixed(3)}
      </Typography>
      <Divider />
      <Typography variant="h5" component={"p"}>
        Pно - вероятность не обнаружения ошибки в ПК
        <br />
        {calculations.errorUnrecog.formula} ={" "}
        {calculations.errorUnrecog.res.toFixed(3)}
      </Typography>
      <Divider />
      <Typography variant="h5" component={"p"}>
        Pоо - вероятность обнаружения ошибки в ПК
        <br />
        {calculations.errorDirect.formula} ={" "}
        {calculations.errorDirect.res.toFixed(3)}
      </Typography>
      <Divider />
      <Typography variant="h5" component={"p"}>
        P*л - вероятность выдачи сообщения с ошибкой при отсутствии ошибки в канале
        <br />
        {calculations.msgWithError.formula} ={" "}
        {calculations.msgWithError.res.toFixed(3)}
      </Typography>
      <Divider />
      <Typography variant="h5" component={"p"}>
        Pнпд - допустимая вероятность неправильного приема сигнала
        <br />
        {calculations.acceptProbError.formula} ={" "}
        {calculations.acceptProbError.res.toFixed(3)}
      </Typography>
      <Divider />
      <Typography variant="h5" component={"p"}>
        Pнп - вероятность неправильного приема
        <br />
        {calculations.errorSuccess.formula} ={" "}
        {calculations.errorSuccess.res}
      </Typography>
      <Divider />
      <Typography variant="h5" component={"p"}>
        a - среднее число передач сообщений до принятия окончательного решения
        <br />
        {calculations.avgTransMsg.formula} ={" "}
        {calculations.avgTransMsg.res.toFixed(3)}
      </Typography>
      <Divider />
    </Box>
  );
};
