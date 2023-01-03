using InterviewTest.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;

namespace InterviewTest.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ListController : ControllerBase
    {
        public ListController()
        {
        }

        /*
         * List API methods goe here
         * */

        [Route("GetEmployee")]
        [HttpGet] 
        public JsonResult GetEmployeeList()
        {
            var employee = new List<Employee>();

            var connectionStringBuilder = new SqliteConnectionStringBuilder(); 
            connectionStringBuilder.DataSource = "./SqliteDB.db";
            using(var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var selectCmd = connection.CreateCommand();
                selectCmd.CommandText = @"SELECT Name, Value FROM Employees";
                using (var reader = selectCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        employee.Add(new Employee
                        {
                            Name = reader.GetString(0),
                            Value = reader.GetInt32(1)
                        });
                    }
                }
            }

            return new JsonResult(employee);
        }

           [Route("AddEmployee")]
        [HttpPost]
        public JsonResult PostEmployee(Employee employee)
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder();
            connectionStringBuilder.DataSource = "./SqliteDB.db";
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"INSERT INTO Employees VALUES ('" + employee.Name + @"', " + employee.Value + @")";
                queryCmd.ExecuteNonQuery();
            }

            return new JsonResult("Employee created successfully");
        }

        [Route("DeleteEmployee/{name}")]
        [HttpDelete] 
        public JsonResult DeleteEmployee(string name)
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder();
            connectionStringBuilder.DataSource = "./SqliteDB.db";
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"DELETE FROM Employees WHERE Name = '" + name + @"'";
                queryCmd.ExecuteNonQuery();
            }

            return new JsonResult("Employee deleted successfully");
        }

        [Route("PutEmployee")]
        [HttpPut]
        public JsonResult PutEmployee(Employee employee)
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder();
            connectionStringBuilder.DataSource = "./SqliteDB.db";
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"UPDATE Employees SET Value = " + employee.Value + @" WHERE Name = '" + employee.Name + @"'";
                queryCmd.ExecuteNonQuery();
            }

            return new JsonResult("Employee updated successfully");
        }


        [Route("Increment")]
        [HttpGet] 
        public JsonResult Increment()
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder();
            connectionStringBuilder.DataSource = "./SqliteDB.db";
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"
                    UPDATE Employees 
                    SET Value = Value +
                        CASE 
                        WHEN Name LIKE 'E%' THEN 1
                        WHEN Name LIKE 'G%' THEN 10
                        ELSE 100
                    END";
                queryCmd.ExecuteNonQuery();
            }

            return new JsonResult("Value incremented uccessful");
        }

        
        public struct Sums
        {
          public string X { get; set; }
          public int Y { get; set; }

          public Sums(string x, int y)
          {
            X = x;
            Y = y;
          }

          public override string ToString()
          {
            return $"({X}, {Y})";
          }
        }


        [Route("SumList")]
        [HttpGet]
        public JsonResult SumList()
        {
            var sums = new List<Sums>();
            var connectionStringBuilder = new SqliteConnectionStringBuilder(); 
            connectionStringBuilder.DataSource = "./SqliteDB.db";
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"
                    SELECT SUM(Value) AS TotalSum, 'A' as Name From Employees WHERE Name LIKE 'A%'
                    UNION
                    SELECT SUM(Value) AS TotalSum, 'B' as Name From Employees WHERE Name LIKE 'B%'
                    UNION
                    SELECT SUM(Value) AS TotalSum, 'C' as Name From Employees WHERE Name LIKE 'C%'"; 
                using (var reader = queryCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        int value = reader.GetInt32(0);
                        string key = reader.GetString(1);
                        if(value >= 11171)
                            sums.Add(new Sums(key, value));
                    }
                }
            }

            return new JsonResult(sums);
        }
                  

    }
}
