const EmptyState = ({ icon = '📭', title = 'No items found', description = 'There are no items to display at this time.', actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="text-6xl mb-6 opacity-80">{icon}</div>
    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 text-base md:text-lg max-w-md mb-6 leading-relaxed">{description}</p>
    {actionLabel && onAction && (
      <button onClick={onAction} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors">
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
