using System.Linq.Expressions;

namespace LabCourse1.Infrastructure.Repositories;

public interface IGenericRepository<T> where T : class
{
    Task<T> AddAsync(T entity);
    Task<T?> GetByIdAsync(int id);
    IQueryable<T> Query(Expression<Func<T, bool>>? predicate = null);
    Task<bool> DeleteAsync(int id);
    Task<int> SaveChangesAsync();
}
