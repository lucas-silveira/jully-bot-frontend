import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { dayWeek } from '@utils/day-week.enum';
import * as S from './styles';

type OpeningHoursTableProps = {
  data: Array<{
    dayWeek: number;
    startHour: string;
    endHour: string;
  }>;
};

export default function OpeningHoursTable({
  data,
}: OpeningHoursTableProps): JSX.Element {
  return (
    <S.TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dia da semana</TableCell>
            <TableCell align="right">Início</TableCell>
            <TableCell align="right">Fim</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map(openingHour => (
            <TableRow key={openingHour.dayWeek}>
              <TableCell component="th" scope="row">
                {dayWeek[openingHour.dayWeek]}
              </TableCell>
              <TableCell align="right">{openingHour.startHour}</TableCell>
              <TableCell align="right">{openingHour.endHour}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </S.TableContainer>
  );
}
