using Microsoft.EntityFrameworkCore;

namespace LabCourse1.Infrastructure.Repositories;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    private readonly Data.AppDbContext _db;
    private readonly DbSet<T> _set;
    public GenericRepository(Data.AppDbContext db) { _db = db; _set = _db.Set<T>(); }

    public async Task<T> AddAsync(T entity)
    {
        await _set.AddAsync(entity);
        await _db.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var e = await _set.FindAsync(id);
        if (e is null) return false;
        _set.Remove(e);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<T?> GetByIdAsync(int id) => await _set.FindAsync(id);

    public IQueryable<T> Query(System.Linq.Expressions.Expression<Func<T, bool>>? predicate = null)
        => predicate is null ? _set.AsQueryable() : _set.Where(predicate);

    public Task<int> SaveChangesAsync() => _db.SaveChangesAsync();
}
