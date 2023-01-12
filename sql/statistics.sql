create or replace function backtest_statistics() return 
	begin 
		SELECT avg( (co."executedQty"/oo."executedQty") )
		FROM public."backtestOperation" bo
		inner join "backtestOrder" oo ON "openOrderId" = oo.id 
		inner join "backtestOrder" co ON "closeOrderId" = co.id 
		where bo."backtestId" = 'c12020aa-18f1-423c-84af-91ff02cdd447'
	end;
$$

backtest_statistics();